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
    [Microsoft.AspNetCore.Authorization.Authorize]
    [Permission(UserPermission.AccountManagement)]
    public class GetUserGroupById: IRequest<UserGroup>
    {
        public int Id { get; set; }
    }
    public partial class GetUserGroupByIdHandler
    {
        public async Task<UserGroup> Handle(GetUserGroupById request, CancellationToken cancellationToken)
        {
            var userGroup = await _applicationDbContext.UserGroups
                .Include(r => r.UserRoles)
                .ThenInclude(x => x.PermissionSet)
                .Include(r => r.UserRoles)
                .ThenInclude(y => y.RoomSet)
                .SingleOrDefaultAsync(r => r.Id == request.Id);
            return userGroup;
        }
    }
}