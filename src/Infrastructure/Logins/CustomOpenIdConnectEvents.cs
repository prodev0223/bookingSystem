using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using booking.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Identity;

namespace booking.Infrastructure.Logins
{
    public class CustomOpenIdConnectEvents : OpenIdConnectEvents
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public CustomOpenIdConnectEvents(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public override async Task AuthenticationFailed(AuthenticationFailedContext context) =>
            await this.OnAuthenticationFailed(context);

        public override async Task AuthorizationCodeReceived(AuthorizationCodeReceivedContext context) =>
            await this.OnAuthorizationCodeReceived(context);

        public override async Task RedirectToIdentityProvider(RedirectContext context) =>
            await this.OnRedirectToIdentityProvider(context);

        public override async Task RedirectToIdentityProviderForSignOut(RedirectContext context) =>
            await this.OnRedirectToIdentityProviderForSignOut(context);

        public override async Task SignedOutCallbackRedirect(RemoteSignOutContext context) =>
            await this.OnSignedOutCallbackRedirect(context);

        public override async Task RemoteSignOut(RemoteSignOutContext context) => await this.OnRemoteSignOut(context);

        public override async Task TokenResponseReceived(TokenResponseReceivedContext context) =>
            await this.OnTokenResponseReceived(context);

        public override async Task TokenValidated(TokenValidatedContext context) => await this.OnTokenValidated(context);

        public override async Task UserInformationReceived(UserInformationReceivedContext context) =>
            await this.OnUserInformationReceived(context);

        public override async Task MessageReceived(MessageReceivedContext context)
        {
            // Set breakpoint in here to see what is happening

            if (!string.IsNullOrEmpty(context.ProtocolMessage.Error) &&
                !string.IsNullOrEmpty(context.ProtocolMessage.ErrorDescription))
            {
                if (context.ProtocolMessage.ErrorDescription.StartsWith("AADB2C90118")) // forgot password
                {
                    context.HandleResponse();
                    context.Response.Redirect("/Account/ResetPassword");
                }
                else
                {
                    context.HandleResponse();
                    context.Response.Redirect("/");
                }
            }
            else
            {
                var jwtTokenAzureAD = context.ProtocolMessage.IdToken;
                var handler = new JwtSecurityTokenHandler();
                var token = handler.ReadJwtToken(jwtTokenAzureAD);
                var userFirstName = token.Payload;

                foreach (var v in token.Payload.Claims)
                {
                    Console.WriteLine(v);
                }

                var oid = token.Payload.Claims.First(v => v.Type == "oid");
                var unique_name = token.Payload.Claims.First(v => v.Type == "unique_name").Value;
                var userinfo = await _userManager.FindByLoginAsync("AAD", oid.Value);

                if (userinfo is null)
                {
                    var newAppUser = new ApplicationUser()
                    {
                        UserName = unique_name,
                    };
                    var res = await _userManager.CreateAsync(newAppUser);
                    if (res.Succeeded)
                    {
                        var newUserId = newAppUser.Id;
                        await _userManager.AddLoginAsync(newAppUser, new UserLoginInfo("AAD", oid.Value, unique_name));
                        userinfo = newAppUser;
                    }
                }

                var family_name = token.Payload.Claims.FirstOrDefault(v => v.Type == "family_name");

                var props = new AuthenticationProperties();
                await _signInManager.SignInAsync(userinfo, false);
                // var info = await _signInManager.GetExternalLoginInfoAsync();
                // var info2 = info.LoginProvider;

                // On successful password reset we need to do this or we get a message.State is null or empty
                context.HandleResponse();
                context.Response.Redirect("/");
            }

            return; // Task.FromResult(0);
        }
    }
}