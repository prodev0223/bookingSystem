using System.Threading;
using System.Threading.Tasks;
using booking.Domain.Entities;

namespace booking.Application.Common.Interfaces
{
    public interface IBookingService
    {
        public Task<Booking> GetBookings(int bookingId, CancellationToken ct);
        public Task<bool> UpdateBookings(int bookingId, Booking booking, CancellationToken ct);
        public Task<bool> CreateBookings(Booking booking, CancellationToken ct);
    }
}