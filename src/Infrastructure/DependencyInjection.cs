using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using booking.Application.Common.BookingChecker;
using booking.Application.Common.Interfaces;
using booking.Infrastructure.BookingActions;
using booking.Infrastructure.BookingChecker;
using booking.Infrastructure.EmailSending;
using booking.Infrastructure.Files;
using booking.Infrastructure.Identity;
using booking.Infrastructure.Logins;
using booking.Infrastructure.Persistence;
using booking.Infrastructure.ServiceHelper;
using booking.Infrastructure.Services;
using booking.Infrastructure.UsersActions;
using FluentEmail.MailKitSmtp;
using Hangfire;
using Hangfire.SqlServer;
using IdentityServer4;
using MailKit.Security;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using AuthenticationFailedContext = Microsoft.AspNetCore.Authentication.OpenIdConnect.AuthenticationFailedContext;
using MessageReceivedContext = Microsoft.AspNetCore.Authentication.OpenIdConnect.MessageReceivedContext;
using TokenValidatedContext = Microsoft.AspNetCore.Authentication.OpenIdConnect.TokenValidatedContext;
using UserActions = booking.Infrastructure.UsersActions.UserActions;

namespace booking.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services,
            IConfiguration configuration)
        {
            if (configuration.GetValue<bool>("UseInMemoryDatabase"))
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseInMemoryDatabase("bookingDb"));
            }
            else
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(
                        configuration.GetConnectionString("DefaultConnection"),
                        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));
            }

            services.AddScoped<IApplicationDbContext>(provider => provider.GetService<ApplicationDbContext>());

            services.AddScoped<IDomainEventService, DomainEventService>();

            
            services
                .AddDefaultIdentity<ApplicationUser>()
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddIdentityServer(
                    options =>
                    {
                        options.Events.RaiseErrorEvents = true;
                        options.Events.RaiseInformationEvents = true;
                        options.Events.RaiseFailureEvents = true;
                        options.Events.RaiseSuccessEvents = true;
                        //options.UserInteraction.LoginUrl = "/Account/Login";
                        //options.UserInteraction.LogoutUrl = "/Account/Logout";
                        options.Discovery.CustomEntries.Add("local_api", "~/localapi");
                        options.IssuerUri = configuration.GetValue<string>("IdentityServerUrl");

                        //For custom login logout page
                        //options.UserInteraction.LoginUrl = "http://localhost:3000";
                        //options.UserInteraction.ErrorUrl = "http://localhost:3000/error";
                        //options.UserInteraction.LogoutUrl = "http://localhost:3000/logout";
                    })
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

            services.AddTransient<IDateTimeService, DateTimeServiceService>();
            services.AddTransient<IIdentityService, IdentityService>();
            services.AddTransient<ICsvFileBuilder, CsvFileBuilder>();
            services.AddTransient<IHashIdService, HashIdService>();
            services.AddScoped<IBookingAction, BookingAction>();
            services.AddScoped<IBookingRule, BookingRule>();
            
            services.AddScoped<IBookingService, BookingService>();
            services.AddScoped<ISettingsService , SettingsService>();
            services.AddScoped<IEmailSendingService, EmailSendingService>();
            services.AddScoped<ISendEmail, SendEmail>();
            
            services.AddScoped<IUserActions, UserActions>();
            services.AddScoped<CustomOpenIdConnectEvents , CustomOpenIdConnectEvents>();

            services.AddAuthentication()
                .AddIdentityServerJwt()
                .AddOpenIdConnect("AAD", "Azure Active Directory", options =>
                {
                    options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
                    options.SignOutScheme = IdentityServerConstants.SignoutScheme;
                    options.Authority = "https://login.microsoftonline.com/678a75fe-d291-4d3c-a00e-ebb016d9a432";
                    options.ClientId = "0ab71004-a249-422c-a0a0-bb04cdbc1337";
                    //  options.Scope.Add("openid");
                    //  options.Scope.Add("profile");
                    //options.CallbackPath = "/signin-oidc";
                    //options.SignedOutCallbackPath = "/signout-callback-aad";
                    //options.RemoteSignOutPath = "/signout-oidc";
                    //options.TokenValidationParameters = new TokenValidationParameters
                    //{
                    //    NameClaimType = "name",
                    //    RoleClaimType = "role",
                    //    ValidateIssuer = false
                    //};
                    //options.GetClaimsFromUserInfoEndpoint = true;
                    options.EventsType = typeof(CustomOpenIdConnectEvents);
                });

            /*
            services.Configure<JwtBearerOptions>(
                IdentityServerJwtConstants.IdentityServerJwtBearerScheme,
                options =>
                {
                    var onOnChallenge = options.Events.OnChallenge;
                    var onOnForbidden = options.Events.OnForbidden;
                    var onOnAuthenticationFailed = options.Events.OnAuthenticationFailed;
                    var OnMessageReceived = options.Events.OnMessageReceived;
                    var onTokenValidated = options.Events.OnTokenValidated;

                    options.Events.OnTokenValidated = async context =>
                    {
                        await onTokenValidated(context);
                    };
                    options.Events.OnAuthenticationFailed = async context =>
                    {
                        await onOnAuthenticationFailed(context);
                    };
                    options.Events = new JwtBearerEvents()
                    {
                        OnMessageReceived = context =>
                        {
                            context.Token = context.HttpContext.Request.Headers["X-JWT-Assertion"];
                            return Task.CompletedTask;
                        }
                    };
                });
            */

            services.AddAuthorization(options =>
            {
                options.AddPolicy("CanPurge", policy => policy.RequireRole("Administrator"));
            });
            services
               .AddFluentEmail("fromemail@test.test")
               .AddMailKitSender(new SmtpClientOptions
                {
                    Server = "smtp.office365.com",
                    Port = 587,
                    User = "hugo@ast-hk.com",
                    Password = "Awholeneworld!",
                    UseSsl = true,
                    UsePickupDirectory = false,
                    RequiresAuthentication = true,
                    SocketOptions = SecureSocketOptions.StartTls,
                });
            // Add Hangfire services.
            services.AddHangfire(config => config
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseSqlServerStorage(configuration.GetConnectionString("HangfireConnection"), new SqlServerStorageOptions
                {
                    CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
                    SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
                    QueuePollInterval = TimeSpan.Zero,
                    UseRecommendedIsolationLevel = true,
                    DisableGlobalLocks = true
                }));

            // Add the processing server as IHostedService
            services.AddHangfireServer();

            return services;
        }
    }
}
