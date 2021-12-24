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
    public class GetBookingListTest : TestBase
    {
        [Test]
        public async Task ShouldGetBookings()
        {
            string userId = await RunAsAdministratorAsync();
            
            int hour = 10;

            var roomsetting2 = new RoomSettings
            {
                BookingPeriods = new List<RoomTimeslot>()
                {
                    new RoomTimeslot()
                    {
                        DayOfWeek = DateTime.Today.DayOfWeek,
                        StartTime = DateTime.Today,
                        EndTime   = DateTime.Today.AddHours(hour),
                        Interval  = TimeSpan.FromHours(1)
                    }
                }
            };

            var makeRMcommand2 = new CreateRoomCommand
            {
                    Name                 = "Room Name Test2",
                    Start                = DateTime.Today,
                    End                  = DateTime.Today.AddHours(hour),
                    TimeSpanMinutes    = 60,
            };

            var rmID2 = await SendAsync(makeRMcommand2);

            int rm2code = rmID2;

            GetAvailableBookingCommand gcommand = new()
            {
                RoomIds = new List<int>(){rm2code},
                Start       = DateTime.SpecifyKind(DateTime.Today, DateTimeKind.Local),
                End         = DateTime.SpecifyKind(DateTime.Today, DateTimeKind.Local),
            };

            IEnumerable<SimpleBookingDto> blist = await SendAsync(gcommand);
            blist.Count().Should().Be(hour);
            var fi = blist.First();

            string oneBookingcode = blist.First().InfoCode;
            var    tarstart       = blist.First().Start;
            var    tarend         = blist.First().End;
            int    h              = 3;

            var testdes = "This is test";
            var createSimpleBookingCommand = new CreateSimpleBookingCommand
            {
                BookingType = BookingType.UserWithCard,
                Name        = "Unit Test",
                StartTime = blist.First().Start,
                EndTime = blist.First().End.AddHours(h),
                BookingDetailDto = new BookingDetailDto
                {
                    Description = testdes,
                },
                RoomId = rmID2,
                
            };

            int bookingid = await SendAsync(createSimpleBookingCommand);

            var bookinginfo = await FindAsync<Booking>(bookingid);
            var BookingDetails = await FindAsync<BookingDetails>(bookinginfo.BookingDetailsId);
            bookinginfo.Start.Should().Be(tarstart);
            bookinginfo.End.Should().Be(tarend.AddHours(h));
            BookingDetails.Description.Should().Be(testdes);

            var existingBookingsCommand = new GetRawExistingBookingsCommand
            {
                Start = tarstart,
                End   = tarend.AddHours(h),
            };
            var blist2 = await SendAsync(existingBookingsCommand);
            blist2.Count().Should().Be(1);
            
            GetAvailableBookingCommand gcommand2 = new()
            {
                RoomIds = new List<int>(){rm2code},
                Start       = DateTime.SpecifyKind(DateTime.Today, DateTimeKind.Local),
                End         = DateTime.SpecifyKind(DateTime.Today, DateTimeKind.Local),
            };
            
            blist = await SendAsync(gcommand2);
            blist.Count().Should().Be(hour - h);
            var getMyRawBookings = new GetMyBookingsCommand();
            var a = await SendAsync(getMyRawBookings);
            a.Count().Should().Be(1);
        }
    }
}