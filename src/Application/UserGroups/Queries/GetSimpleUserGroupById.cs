using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Application.UserGroups.Queries.GetMyUserGroup;
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
    [Microsoft.AspNetCore.Authorization.Authorize]
    [Permission(UserPermission.AccountManagement)]
    public class GetSimpleUserGroupById : IRequest<UserGroupDto>
    {
        public int Id { get; set; }
    }

    public partial class GetSimpleUserGroupByIdHandler
    {
        public async Task<UserGroupDto> Handle(GetSimpleUserGroupById request, CancellationToken cancellationToken)
        {
            var userGroup = await _applicationDbContext.UserGroups
                .Include(r => r.UserRoles)
                .Include(r => r.UserGroupApplicationUsers)
                .SingleOrDefaultAsync(r => r.Id == request.Id);
            var simpleUserGroup = new UserGroupDto();
            simpleUserGroup.Id = userGroup.Id;
            simpleUserGroup.Created = userGroup.Created;
            simpleUserGroup.CreatedBy = userGroup.CreatedBy;
            simpleUserGroup.LastModified = userGroup.LastModified;
            simpleUserGroup.LastModifiedBy = userGroup.LastModifiedBy;
            simpleUserGroup.UserIds = userGroup.UserGroupApplicationUsers?.Select(i => i.ApplicationUserId);
            simpleUserGroup.UserRoleIds = userGroup.UserRoles?.Select(i => i.Id);
            simpleUserGroup.Name = userGroup.Name;

            return simpleUserGroup;
        }
    }
}