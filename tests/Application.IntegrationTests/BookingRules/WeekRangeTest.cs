using System;
using System.Threading.Tasks;
using booking.Application.Bookings.Commands.Cancel;
using booking.Application.Common.BookingChecker;
using booking.Infrastructure.BookingChecker;
using FluentAssertions;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.BookingRules
{
    using static Testing;

    public class WeekRangeTest : TestBase
    {
        [Test]
        public async Task ShouldCannotCancel()
        {
            IBookingRule bookingRules = new BookingRule(null);
            var bStart = DateTime.Now;
            var bEnd = DateTime.Now.AddHours(1);
            var res = bookingRules.GetFullWeekRange(bStart, bEnd);
            var tarStart = new DateTime(2021, 9, 20, 0, 0, 0);
            var tarEnd = new DateTime(2021, 9, 27, 0, 0, 0);
            res.start.Should().Be(tarStart);
            res.end.Should().Be(tarEnd);
            
            res = bookingRules.GetFullWeekRange(bStart, bEnd, DayOfWeek.Sunday);
            tarStart = new DateTime(2021, 9, 19, 0, 0, 0);
            tarEnd = new DateTime(2021, 9, 26, 0, 0, 0);
            res.start.Should().Be(tarStart);
            res.end.Should().Be(tarEnd);
        }
    }
}