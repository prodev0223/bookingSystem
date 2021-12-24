using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using booking.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace booking.Infrastructure.UserResources
{
    public class UserResourcesSimple : IUserResource
    {
        private IApplicationDbContext _applicationDbContext;

        public UserResourcesSimple(IApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public async Task<IList<int>> GetRoomsWith(UserPermission userPermission, CancellationToken cancellationToken)
        {
            // Currently returning all rooms
            var roomIds = await _applicationDbContext.Rooms.AsNoTracking().Select(i => i.Id)
                                                     .ToListAsync(cancellationToken);
            return roomIds;
        }

        public async Task<IList<int>> GetRoomsWith(IEnumerable<UserPermission> userPermissions,
                                                   CancellationToken           cancellationToken)
        {
            // Currently returning all rooms
            var roomIds = await _applicationDbContext.Rooms.AsNoTracking().Select(i => i.Id)
                                                     .ToListAsync(cancellationToken);
            return roomIds;
        }

        public async Task<IList<int>> GetBookingsWith(UserPermission    userPermission,
                                                      CancellationToken cancellationToken)
        {
            // Currently returning all bookingIds
            var bookingIds = await _applicationDbContext.Rooms.AsNoTracking().Select(i => i.Id)
                                                        .ToListAsync(cancellationToken);
            return bookingIds;
        }

        public async Task<IList<int>> GetBookingsWith(IEnumerable<UserPermission> userPermissions,
                                                      CancellationToken           cancellationToken)
        {
            // Currently returning all bookingIds
            var bookingIds = await _applicationDbContext.Rooms.AsNoTracking().Select(i => i.Id)
                                                        .ToListAsync(cancellationToken);
            return bookingIds;
        }
    }
}