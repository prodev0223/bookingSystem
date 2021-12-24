using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Application.UserGroups.Queries.GetMyUserGroup;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace booking.Application.UserGroups.Queries
{
    [MediatrInject(
        MediatrServiceType.ApplicationDbContext,
        MediatrServiceType.Mapper,
        MediatrServiceType.CurrentUserService
    )]
    [Permission(UserPermission.AccountManagement)]
    public class GetLoggedUserGroupCommand : IRequest<IEnumerable<LoggedUserInfo>>
    {
    }

    public partial class GetLoggedUserGroupCommandHandler
    {
        public async Task<IEnumerable<LoggedUserInfo>> Handle(GetLoggedUserGroupCommand request, CancellationToken ct)
        {
            List<LoggedUserInfo> userGroups = new List<LoggedUserInfo>();

            var userId = _currentUserService.UserId;
            var userGroupList = await
                _applicationDbContext.UserGroups
                    .Include(r => r.UserRoles)
                    .Include(r => r.UserGroupApplicationUsers)
                    .Where(r => r.UserGroupApplicationUsers.Any(i => i.ApplicationUserId == userId))
                    .ToListAsync(ct);

            if (userGroupList != null)
            {
                foreach (var userGroup in userGroupList)
                {
                    userGroups.Add(new LoggedUserInfo()
                    {
                        Id = userGroup.Id,
                        Name = userGroup.Name,
                        UserRoleIds = userGroup.UserRoles?.Select(i => i.Id),
                        UserRoleNames = userGroup.UserRoles?.Select(i => i.Name),
                    });
                }
            }

            return userGroups;
        }
    }
}