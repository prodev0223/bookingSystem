using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;

namespace booking.Application.UserPermissions.Queries
{
    [MediatrInject(MediatrServiceType.IdentityService, MediatrServiceType.CurrentUserService, MediatrServiceType.ApplicationDbContext)]
    public class GetMyRoomsPermissionQuery : IRequest<IEnumerable<UserGroup>>
    {
    }

    public partial class GetMyRoomsPermissionQueryHandler
    {
        public async Task<IEnumerable<UserGroup>> Handle(GetMyRoomsPermissionQuery request, CancellationToken cancellationToken)
        {
            throw new NoNullAllowedException();
            //return await _applicationDbContext.GetUserRoomsPermission(_currentUserService.UserId, cancellationToken);
        }
    }
}