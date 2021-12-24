using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace booking.Application.Common.Interfaces
{
    public interface IUserActions
    {
        Task AddUserToGroup(string userId, IEnumerable<int> groupIds, CancellationToken cancellationToken);
    }
}