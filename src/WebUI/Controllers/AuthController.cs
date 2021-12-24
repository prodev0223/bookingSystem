using booking.Application.Models;
using booking.Infrastructure.Identity;
using booking.WebUI.Models;
using booking.WebUI.Models.Authentication;
using booking.WebUI.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace booking.WebUI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly JwtHandler _jwtHandler;
        private readonly ILogger<AuthController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        public IList<AuthenticationScheme> ExternalLogins { get; set; }

        public AuthController(SignInManager<ApplicationUser> signInManager,
            ILogger<AuthController> logger,
            UserManager<ApplicationUser> userManager, JwtHandler jwtHandler)
        {
            _logger = logger;
            _jwtHandler = jwtHandler;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost]
        [Route("signin")]
        public async Task<APIResponse> SignInAsync(SignInModel model)
        {
            APIResponse response = new(MESSAGE.LOAD_FAILED, false);

            if (model != null)
            {
                var user = await _userManager.FindByNameAsync(model.Email);

                if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
                {
                    var userRoles = await _userManager.GetRolesAsync(user);

                    var authClaims = new List<Claim>
                    {
                        new Claim("UserId",user.Id),
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.NameIdentifier,user.Id)
                    };

                    foreach (var userRole in userRoles)
                    {
                        authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                    }

                    var signingCredentials = _jwtHandler.GetSigningCredentials();
                    var tokenOptions = _jwtHandler.GenerateTokenOptions(signingCredentials, authClaims);
                    var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

                    response.UpdateStatus(MESSAGE.LOADED, true);
                    response.AnyData = new { Username = user.UserName, Token = token };
                }
            }

            return response;
        }
    }
}