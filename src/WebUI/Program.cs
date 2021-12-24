using booking.Infrastructure.Identity;
using booking.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using Serilog;

namespace booking.WebUI
{
    public class Program
    {
        public async static Task Main(string[] args)
        {
          Log.Logger = new LoggerConfiguration()
            .WriteTo.SQLite( "/home/his/asf.db", "Log", storeTimestampInUtc:false)
            .WriteTo.Console()
            .CreateLogger();
            
            var host = CreateHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;

                try
                {
                    var context = services.GetRequiredService<ApplicationDbContext>();

                    if (context.Database.IsSqlServer())
                    {
                        context.Database.Migrate();
                    }                   

                    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
                    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

                    var userId = await ApplicationDbContextSeed.SeedDefaultUserAsync(userManager, roleManager);
                    if (userId is not null)
                    {
                        await ApplicationDbContextSeed.SeedSuperRole(context, userId);
                        await ApplicationDbContextSeed.SeedSampleDataAsync(context);
                    }
                    
                }
                catch (Exception ex)
                {
                    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

                    logger.LogError(ex, "An error occurred while migrating or seeding the database.");

                    throw;
                }
            }

            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSerilog()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                    webBuilder.ConfigureAppConfiguration((hostingContext, config) =>
                    {
                        var settings = config.Build();
                        //config.AddAzureAppConfiguration(options =>
                        //{
                        //    options.Connect(settings["ConnectionStrings:AppConfig"])
                        //        .ConfigureRefresh(refresh =>
                        //        {
                        //            refresh.Register("TestApp:Settings:Sentinel", refreshAll: true)
                        //                .SetCacheExpiration(new TimeSpan(0, 5, 0));
                        //        });
                        //});
                    });
                })
            ;
    }
}
