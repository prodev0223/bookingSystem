using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Users.Queries.GetUsers
{
    [MediatrInject(MediatrServiceType.ApplicationDbContext, MediatrServiceType.IdentityService)]
    [Permission(UserPermission.AccountManagement)]
    public class GetUserinfoCommand : IRequest<IEnumerable<UserGroup>>
    {
        public string UserId { get; set; }
    }
    public partial class GetUserinfoCommandHandler
    {
        public async Task<IEnumerable<UserGroup>> Handle(GetUserinfoCommand request, CancellationToken cancellationToken)
        {
            var userId = request.UserId;
            List<UserGroup> userGroupList =
                await _applicationDbContext.UserGroupApplicationUsers
                    .Include(r => r.UserGroup)
                    .Where(r => r.ApplicationUserId == userId)
                    .Select(r => r.UserGroup)
                    .ToListAsync(cancellationToken);

            return userGroupList;
        }
    }
}