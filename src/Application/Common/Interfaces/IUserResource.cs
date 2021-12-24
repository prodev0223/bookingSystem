using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using booking.Domain.Enums;

namespace booking.Application.Common.Interfaces
{
    public interface IUserResource
    {
        Task<IList<int>> GetRoomsWith(UserPermission userPermission, CancellationToken cancellationToken);


        Task<IList<int>> GetRoomsWith(IEnumerable<UserPermission> userPermissions, CancellationToken cancellationToken);

        Task<IList<int>> GetBookingsWith(UserPermission userPermission, CancellationToken cancellationToken);

        Task<IList<int>> GetBookingsWith(IEnumerable<UserPermission> userPermissions,
                                         CancellationToken           cancellationToken);
    }
}