using System;
using System.Linq;
using System.Threading.Tasks;
using booking.Application.Bookings.Commands.Cancel;
using booking.Application.Bookings.Commands.Create;
using booking.Application.Common.Exceptions;
using booking.Application.Rooms.Commands.CreateRooms;
using booking.Application.Rooms.Queries.GetOneRoom;
using booking.Application.RoomSets.Commands.CreateRoomSet;
using booking.Application.UserGroups.Queries.GetMyUserGroup;
using FluentAssertions;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.Bookings.Commands
{
    using static Testing;

    public class CreateBookingTest : TestBase
    {
        [Test]
        public async Task ShouldBookFixedTimeInterval()
        {
            var userId = await RunAsDefaultUserAsync();
            await AddUserToGroup(userId, TestingSeedData.SimpleFixedBookingTimeUserGroup());
            var res1 = await SendAsync(new GetMyUserGroup());
            res1.Count().Should().Be(1);
            var firstRoomId = res1.First().UserRoles.Where(i => i.RoomSet.Rooms.Any()).First().RoomSet.Rooms.First().Id;
            GetOneRoomQuery getOneRoomQuery = new()
            {
                RoomId = firstRoomId
            };
            var command = new CreateSimpleBookingCommand()
            {
                Name = userId,
                StartTime = DateTime.Today.AddHours(10),
                EndTime = DateTime.Today.AddHours(11),
                RoomId = firstRoomId
            };
            var res = await SendAsync(command);
            res.Should().BeGreaterThan(0);
        }

        [Test]
        public async Task ShouldNotBookFixedTimeInterval()
        {
            var userId = await RunAsDefaultUserAsync();
            await AddUserToGroup(userId, TestingSeedData.SimpleFixedBookingTimeUserGroup());
            var res1 = await SendAsync(new GetMyUserGroup());
            res1.Count().Should().Be(1);
            var firstRoomId = res1.First().UserRoles.Where(i => i.RoomSet.Rooms.Any()).First().RoomSet.Rooms.First().Id;
            GetOneRoomQuery getOneRoomQuery = new()
            {
                RoomId = firstRoomId
            };
            var command = new CreateSimpleBookingCommand()
            {
                Name = userId,
                StartTime = DateTime.Today.AddHours(10),
                EndTime = DateTime.Today.AddHours(11.1),
                RoomId = firstRoomId
            };
            FluentActions.Awaiting(() => SendAsync(command)).Should().Throw<Exception>();
        }

        [Test]
        public async Task ShouldBookFreeTimeInterval()
        {
            var userId = await RunAsDefaultUserAsync();
            await AddUserToGroup(userId, TestingSeedData.SimpleFreeBookingTimeUserGroup(userId));
            var res1 = await SendAsync(new GetMyUserGroup());
            res1.Count().Should().Be(1);
            var firstRoomId = res1.First().UserRoles.Where(i => i.RoomSet.Rooms.Any()).First().RoomSet.Rooms.First().Id;
            GetOneRoomQuery getOneRoomQuery = new()
            {
                RoomId = firstRoomId
            };
            var command = new CreateSimpleBookingCommand()
            {
                Name = userId,
                StartTime = DateTime.Today.AddHours(10),
                EndTime = DateTime.Today.AddHours(11.2),
                RoomId = firstRoomId
            };
            var res = await SendAsync(command);
            res.Should().BeGreaterThan(0);
        }
        
        [Test]
        public async Task ShouldNotBookFreeTimeInterval()
        {
            var userId = await RunAsDefaultUserAsync();
            await AddUserToGroup(userId, TestingSeedData.SimpleFreeBookingTimeUserGroup(userId));
            var res1 = await SendAsync(new GetMyUserGroup());
            res1.Count().Should().Be(1);
            var firstRoomId = res1.First().UserRoles.Where(i => i.RoomSet.Rooms.Any()).First().RoomSet.Rooms.First().Id;
            GetOneRoomQuery getOneRoomQuery = new()
            {
                RoomId = firstRoomId
            };
            var command = new CreateSimpleBookingCommand()
            {
                Name = userId,
                StartTime = DateTime.Today.AddHours(10),
                EndTime = DateTime.Today.AddHours(21.2),
                RoomId = firstRoomId
            };
            FluentActions.Awaiting(() => SendAsync(command)).Should().Throw<Exception>();
        }
        
        [Test]
        public async Task ShouldNotBookFreeTimeIntervalOverLapTime()
        {
            var userId = await RunAsDefaultUserAsync();
            await AddUserToGroup(userId, TestingSeedData.SimpleFixedBookingTimeUserGroup());
            var res1 = await SendAsync(new GetMyUserGroup());
            res1.Count().Should().Be(1);
            var firstRoomId = res1.First().UserRoles.Where(i => i.RoomSet.Rooms.Any()).First().RoomSet.Rooms.First().Id;
            GetOneRoomQuery getOneRoomQuery = new()
            {
                RoomId = firstRoomId
            };
            var command = new CreateSimpleBookingCommand()
            {
                Name = userId,
                StartTime = DateTime.Today.AddHours(10),
                EndTime = DateTime.Today.AddHours(11),
                RoomId = firstRoomId
            };
            var res = await SendAsync(command);
            res.Should().BeGreaterThan(0);
            
            command = new CreateSimpleBookingCommand()
            {
                Name = userId,
                StartTime = DateTime.Today.AddHours(10),
                EndTime = DateTime.Today.AddHours(11),
                RoomId = firstRoomId
            };
            FluentActions.Awaiting(() => SendAsync(command)).Should().Throw<Exception>();
        }
        
        [Test]
        public async Task ShouldNotBookFreeTimeIntervalOverWeeklyLimit()
        {
            var userId = await RunAsDefaultUserAsync();
            await AddUserToGroup(userId, TestingSeedData.SimpleFixedBookingTimeUserGroup());
            var res1 = await SendAsync(new GetMyUserGroup());
            res1.Count().Should().Be(1);
            var firstRoomId = res1.First().UserRoles.Where(i => i.RoomSet.Rooms.Any()).First().RoomSet.Rooms.First().Id;
            GetOneRoomQuery getOneRoomQuery = new()
            {
                RoomId = firstRoomId
            };
            var command = new CreateSimpleBookingCommand()
            {
                Name = userId,
                StartTime = DateTime.Today.AddHours(10),
                EndTime = DateTime.Today.AddHours(11),
                RoomId = firstRoomId
            };
            var res = await SendAsync(command);
            res.Should().BeGreaterThan(0);
            
            command = new CreateSimpleBookingCommand()
            {
                Name = userId,
                StartTime = DateTime.Today.AddHours(11),
                EndTime = DateTime.Today.AddHours(12),
                RoomId = firstRoomId
            };
            res = await SendAsync(command);
            res.Should().BeGreaterThan(0);
            
            command = new CreateSimpleBookingCommand()
            {
                Name = userId,
                StartTime = DateTime.Today.AddHours(12),
                EndTime = DateTime.Today.AddHours(13),
                RoomId = firstRoomId
            };
            FluentActions.Awaiting(() => SendAsync(command)).Should().Throw<Exception>();
        }
    }
}