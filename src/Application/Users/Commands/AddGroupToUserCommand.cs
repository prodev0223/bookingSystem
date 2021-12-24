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
        MediatrServiceType.UserActions,
        MediatrServiceType.ApplicationDbContext
    )]
    [Permission(UserPermission.AccountManagement)]
    public class AddGroupToUserCommand : IRequest<bool>
    {
        public string UserId { get; set; }

        public IEnumerable<int> GroupIds { get; set; } = Enumerable.Empty<int>();
    }

    public partial class AddGroupToUserCommandHandler
    {
        public async Task<bool> Handle(AddGroupToUserCommand request, CancellationToken ct)
        {
            var groupIds = request.GroupIds;

            string userId = request.UserId;
            if (request.GroupIds.Any())
            {
                await _userActions.AddUserToGroup(userId, groupIds, ct);
            }

            await _applicationDbContext.SaveChangesAsync(ct);

            return true;
        }
    }
}