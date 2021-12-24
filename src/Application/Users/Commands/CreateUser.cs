using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Domain.Enums;
using MediatR;

namespace booking.Application.Users.Commands
{
    [MediatrInject(
        MediatrServiceType.IdentityService,
        MediatrServiceType.UserActions
    )]
    [Permission(UserPermission.AccountManagement)]
    public class CreateUserSimpleCommand : IRequest<string>
    {
        public string Username { get; set; }

        public string Password { get; set; }

        public string ExternalUserId { get; set; }
        public IEnumerable<int> GroupIds { get; set; } = Enumerable.Empty<int>();
    }

    public partial class CreateUserSimpleCommandHandler
    {
        public async Task<string> Handle(CreateUserSimpleCommand request, CancellationToken cancellationToken)
        {
            var res = await _identityService.CreateUserAsync(request.Username, request.Password);

            if (res.Result.Succeeded)
            {
                string newUserId = res.UserId;
                if (request.GroupIds.Any())
                {
                    await _userActions.AddUserToGroup(newUserId, request.GroupIds, cancellationToken);
                }
                return res.UserId;
            }

            return "";
        }
    }
}