using System.Collections.Generic;
using System.Linq;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.UserGroups.Commands
{
    [MediatrInject(MediatrServiceType.ApplicationDbContext)]
    public class CreateUserGroupCommand : IRequest<int>
    {
        public string Name { get; set; }
        
        public List<string> UserIds { get; set; }
        
        public IEnumerable<int> UserRoleIds { get; set; }
    }

    public partial class CreateUserGroupCommandHandler 
    {
        public async Task<int> Handle(CreateUserGroupCommand request, CancellationToken ct)
        {
            var userRoleQuery = _applicationDbContext.AppUserRoles
                .Where( r=> request.UserRoleIds.Contains(r.Id));
#if DEBUG
            var x = userRoleQuery.ToQueryString();
            
#endif
            //var userRole = await userRoleQuery.ToListAsync(ct);
            
            var userGroup = new UserGroup
            {
                Name = request.Name,
                UserRoles = userRoleQuery.ToList(),
            };
            if (request.UserIds?.Count > 0)
            {
                //await _applicationDbContext.UserGroups.AddAsync(userGroup, ct);
                await _applicationDbContext.UserGroupApplicationUsers.AddRangeAsync(
                    request.UserIds.Select(uid =>
                        new UserGroupApplicationUser
                        {
                            UserGroup = userGroup,
                            ApplicationUserId = uid,
                        }
                    )
                ,ct);
            }
            else
            {
                await _applicationDbContext.UserGroups.AddAsync(
                    userGroup
                ,ct);
            }
            await _applicationDbContext.SaveChangesAsync(ct);
            return userGroup.Id;
        }
    }
}
