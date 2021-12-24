using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.BookingChecker;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace booking.Infrastructure.BookingChecker
{
    public class BookingRule : IBookingRule
    {
        private readonly IApplicationDbContext _applicationDbContext;
        private readonly IDateTimeService _dateTimeService;
        private object p;

        public BookingRule(IApplicationDbContext applicationDbContext, IDateTimeService dateTimeService)
        {
            _dateTimeService = dateTimeService;
            _applicationDbContext = applicationDbContext;
        }

        public BookingRule(object p)
        {
            this.p = p;
        }

        public async Task<bool> IsValidFixedTime(int roomId, DateTime bookingStart, DateTime bookingEnd,
            CancellationToken ct)
        {
            var isValidCustomTime = await IsValidCustomTime(roomId, bookingStart, bookingEnd, ct);
            if (!isValidCustomTime)
            {
                return false;
            }

            var roomStart = DateTime.MaxValue;
            var roomEnd = DateTime.MinValue;
            var roomInterval = TimeSpan.MaxValue;

            var roomInfo = await GetRoom(roomId, ct);
            foreach (var v in roomInfo.RoomSettings.BookingPeriods)
            {
                if (v.DayOfWeek == bookingStart.DayOfWeek)
                {
                    roomStart = v.StartTime;
                    roomEnd = v.EndTime;
                    roomInterval = v.Interval;
                    break;
                }
            }

            var validRange = ValidRange(ref roomStart, ref roomEnd, ref roomInterval, ref bookingStart, ref bookingEnd);
            return validRange;
        }

        public async Task<Room> GetRoom(int roomId, CancellationToken ct)
        {
            var roomInfo = await _applicationDbContext.Rooms
                .AsNoTracking()
                .Include(i => i.RoomSettings)
                .ThenInclude(i => i.BookingPeriods)
                .FirstAsync(i => i.Id == roomId, ct);
            return roomInfo;
        }


        public async Task<bool> IsValidCustomTime(int roomId, DateTime bookingStart, DateTime bookingEnd,
            CancellationToken ct)
        {
            var sameDay = SameDay(ref bookingStart, ref bookingEnd);
            var isLogicalRange = IsLogicalRange(ref bookingStart, ref bookingEnd);

            if (!(sameDay && isLogicalRange))
            {
                return false;
            }

            var roomStart = DateTime.MaxValue;
            var roomEnd = DateTime.MinValue;

            var roomInfo = await GetRoom(roomId, ct);

            // Todo Get room info
            foreach (var v in roomInfo.RoomSettings.BookingPeriods)
            {
                if (v.DayOfWeek == bookingStart.DayOfWeek)
                {
                    roomStart = v.StartTime;
                    roomEnd = v.EndTime;
                    break;
                }
            }

            var inOpeningHour = InOpeningHour(ref roomStart, ref roomEnd, ref bookingStart, ref bookingEnd);
            return inOpeningHour;
        }

        public Task<bool> IsWithBookingLimit(int roomId, DateTime start, DateTime end, IList<string> userIds,
            CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        private bool SameDay(ref DateTime start, ref DateTime end)
        {
            return start.Date == end.Date;
        }

        private bool IsLogicalRange(ref DateTime start, ref DateTime end)
        {
            return start < end;
        }

        private bool InOpeningHour(ref DateTime roomStart, ref DateTime roomEnd, ref DateTime bookingStart,
            ref DateTime bookingEnd)
        {
            return roomStart.TimeOfDay <= bookingStart.TimeOfDay && bookingEnd.TimeOfDay <= roomEnd.TimeOfDay;
        }

        private bool ValidRange(ref DateTime roomStart, ref DateTime roomEnd, ref TimeSpan roomInterval,
            ref DateTime bookingStart, ref DateTime bookingEnd)
        {
            var startDiff = bookingStart.TimeOfDay - roomStart.TimeOfDay;
            var cnt = startDiff / roomInterval;
            if (!IsInteger(cnt))
            {
                return false;
            }

            return bookingStart.AddMinutes(roomInterval.TotalMinutes) == bookingEnd;
        }

        private bool IsInteger(double num)
        {
            return Math.Abs(Math.Ceiling(num) - Math.Floor(num)) < double.Epsilon;
        }

        public (DateTime start, DateTime end) GetFullWeekRange(DateTime bookingStart, DateTime bookingEnd,
            DayOfWeek startOfWeek = DayOfWeek.Monday)
        {
            var bookingDayOfWeek = bookingStart.DayOfWeek;
            return (
                bookingStart.Date.AddDays(-(bookingDayOfWeek - startOfWeek)),
                bookingStart.Date.AddDays(7 - (bookingDayOfWeek - startOfWeek))
            );
        }

        public bool WithinLimitPerWeek(int roomId, int cnt)
        {
            return cnt < 20;
        }

        public bool IsPastEvent(Booking b)
        {
            return b.End <= _dateTimeService.Now;
        }
    }
}