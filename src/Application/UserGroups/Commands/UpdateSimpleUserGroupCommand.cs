using System.Collections.Generic;
using System.Linq;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Domain.Enums;
using Z.EntityFramework.Plus;

namespace booking.Application.UserGroups.Commands
{
    [MediatrInject(
        MediatrServiceType.ApplicationDbContext,
        MediatrServiceType.BookingAction,
        MediatrServiceType.UserActions
    )]
    [Permission(UserPermission.AccountManagement)]
    public class UpdateSimpleUserGroupCommand : IRequest<int>
    {
        public string UserId { get; set; }
        public IEnumerable<int> GroupIds { get; set; }
    }

    public partial class UpdateSimpleUserGroupCommandHandler
    {
        public async Task<int> Handle(UpdateSimpleUserGroupCommand request, CancellationToken ct)
        {
            var rowRemoved = await _applicationDbContext.UserGroupApplicationUsers
                .Where(i => i.ApplicationUserId == request.UserId).DeleteAsync(ct);
            await _userActions.AddUserToGroup(request.UserId, request.GroupIds, ct);

            await _applicationDbContext.SaveChangesAsync(ct);
            return 1;
        }
    }
}
