using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;

namespace booking.Application.UserPermissions.Queries
{
    [MediatrInject(MediatrServiceType.IdentityService, MediatrServiceType.CurrentUserService)]
    public class GetMySystemPermissionQuery : IRequest<IEnumerable<PermissionSet>>
    {
    }

    public partial class GetMySystemPermissionQueryHandler
    {
        public async Task<IEnumerable<PermissionSet>> Handle(GetMySystemPermissionQuery request, CancellationToken cancellationToken)
        {
            return await _identityService.GetUserSystemPermission(_currentUserService.UserId);
        }
    }
}