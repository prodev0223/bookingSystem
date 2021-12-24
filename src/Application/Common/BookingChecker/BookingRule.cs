using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using booking.Domain.Entities;

namespace booking.Application.Common.BookingChecker
{
    public interface IBookingRule
    {
        Task<bool> IsValidFixedTime(int roomId, DateTime start, DateTime end, CancellationToken ct);
        Task<bool> IsValidCustomTime(int roomId, DateTime start, DateTime end, CancellationToken ct);
        Task<bool> IsWithBookingLimit(int roomId, DateTime start, DateTime end, IList<string> userIds, CancellationToken ct);
        public (DateTime start, DateTime end) GetFullWeekRange(DateTime bookingStart, DateTime bookingEnd, DayOfWeek startOfWeek = DayOfWeek.Monday);
        public bool WithinLimitPerWeek(int roomId, int count);
        public bool IsPastEvent(Booking b);
    }
}