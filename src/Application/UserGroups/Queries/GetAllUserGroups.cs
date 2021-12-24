using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.UserGroups.Queries
{
    [MediatrInject(
        MediatrServiceType.ApplicationDbContext,
        MediatrServiceType.Mapper,
        MediatrServiceType.CurrentUserService
        )]
    [Permission(UserPermission.AllPermission)]
    public class GetAllUserGroups : IRequest<IEnumerable<UserGroup>>
    {
    }

    public partial class GetAllUserGroupsHandler 
    {
        public async Task<IEnumerable<UserGroup>> Handle(GetAllUserGroups request, CancellationToken  ct)
        {
            var userId = _currentUserService.UserId;
            var userGroupList = await 
                _applicationDbContext.UserGroups
                    .Include(r => r.UserRoles)
                    .ToListAsync(ct);

            return userGroupList;
        }
    }
}
