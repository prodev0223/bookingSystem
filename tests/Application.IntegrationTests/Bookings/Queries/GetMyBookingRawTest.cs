using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using booking.Application.Bookings.Commands.Create;
using booking.Application.Bookings.Queries.GetAvailableBookings;
using booking.Application.Bookings.Queries.GetMyBookings;
using booking.Application.Bookings.Queries.GetRawExistingBookings;
using booking.Application.Common.Exceptions;
using booking.Application.Rooms.Commands.CreateRooms;
using booking.Domain.Entities;
using booking.Domain.Enums;
using FluentAssertions;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.Bookings.Queries
{
    using static Testing;

    [TestFixture]
    public class GetMyBookingRawTest : TestBase
    {
        [Test]
        public async Task ShouldGetBookings()
        {
            string userId = await RunAsAdministratorAsync();

            var getMyRawBookings = new GetMyBookingsCommand();
            var rmID2 = await SendAsync(getMyRawBookings);
            rmID2.Count().Should().Be(0);
        }
    }
}
