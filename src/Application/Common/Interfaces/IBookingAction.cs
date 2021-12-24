using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Bookings.Queries.GetAvailableBookings;
using booking.Application.Common.Models;
using booking.Domain.Entities;

namespace booking.Application.Common.Interfaces
{
    public interface IBookingAction
    {
        #region BookingModification
        public Task<Result> NewAsync(Booking booking, IEnumerable<string> userIds, CancellationToken ct);
        
        public Task<Result> CancelAsync(int bookingId, CancellationToken ct);
        
        public Task<Result> ApproveAsync(int bookingId, CancellationToken ct);
        
        public Task<Result> RejectAsync(int bookingId, CancellationToken ct);
        
        public Task<Result> EditAsync(int bookingId, Booking newBooking, CancellationToken ct);
        #endregion
        
        #region BookingView
        public Task<IList<Booking>> MyBookingsAsync(DateTime startPeriod, DateTime endPeriod, CancellationToken ct);
        
        public Task<IList<SimpleBookingDto>> MyPossibleBookingsAsync(DateTime startPeriod, DateTime endPeriod, CancellationToken ct);
        
        public Task<IList<Booking>> MyBookableRangeAsync(DateTime startPeriod, DateTime endPeriod, CancellationToken ct);
        #endregion
        
    }
}