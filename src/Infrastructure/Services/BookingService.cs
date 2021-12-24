using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace booking.Infrastructure.Services
{
    public class BookingService : IBookingService
    {
        private readonly IApplicationDbContext _applicationDbContext;

        public BookingService(IApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public async Task<Booking> GetBookings(int bookingId, CancellationToken ct)
        {
            return await _applicationDbContext.Bookings
                .Include(b => b.BookingApplicationUser)
                .Include(b => b.BookingDetails)
                .FirstOrDefaultAsync(i => i.Id == bookingId, ct);
        }

        public async Task<bool> UpdateBookings(int bookingId, Booking newBooking, CancellationToken ct)
        {
            var existingBooking = await _applicationDbContext.Bookings.Include(i => i.BookingDetails)
                .FirstOrDefaultAsync(i => i.Id == bookingId, ct);
            //var existingBookingId = existingBooking.Id;
            existingBooking.BookingDetails.Description = newBooking.BookingDetails.Description;
            existingBooking.Start = newBooking.Start;
            existingBooking.End = newBooking.End;
            existingBooking.BookingType = newBooking.BookingType;
            var res = await _applicationDbContext.SaveChangesAsync(ct);
            return res > 0;
        }

        public Task<bool> CreateBookings(Booking booking, CancellationToken ct)
        {
            throw new System.NotImplementedException();
        }
    }
}