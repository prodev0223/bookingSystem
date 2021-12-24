using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using booking.Infrastructure.Persistence;

namespace booking.Infrastructure.UsersActions
{
    public class UserActions : IUserActions
    {
        private readonly IApplicationDbContext _applicationDbContext;

        public UserActions(IApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public async Task AddUserToGroup(string userId, IEnumerable<int> groupIds, CancellationToken cancellationToken)
        {
            await _applicationDbContext.UserGroupApplicationUsers.AddRangeAsync(
                groupIds.Select(i =>
                    new UserGroupApplicationUser
                    {
                        UserGroupId = i,
                        ApplicationUserId = userId
                    }), cancellationToken
            );
            await _applicationDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}