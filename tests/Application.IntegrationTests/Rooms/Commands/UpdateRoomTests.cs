using booking.Application.Common.Exceptions;
using booking.Application.TodoItems.Commands.CreateTodoItem;
using booking.Application.TodoLists.Commands.CreateTodoList;
using booking.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;
using System;
using System.Threading.Tasks;
using booking.Application.Rooms.Commands.CreateRooms;
using booking.Application.Rooms.Commands.DeleteRoom;
using booking.Application.Rooms.Commands.UpdateRoom;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.IntegrationTests.Rooms.Commands
{
    using static Testing;

    public class UpdateRoomTests : TestBase
    {
        [Test]
        public async Task ShouldUpdateRoom()
        {
            var userId = await RunAsAdministratorAsync();

            var roomsetting = new RoomSettings
            {
                AutoRelease = 40,
            };
            var roomsetting2 = new RoomSettings();

            var command = new CreateRoomCommand
            {
                    Name                 = "Room Name Test",
                    Start                = DateTime.Today,
                    End                  = DateTime.Today.AddHours(1),
                    TimeSpanMinutes    = 60,
            };
            
            var command2 = new CreateRoomCommand
            {
                    Name                 = "Room Name Test2",
                    Start                = DateTime.Today,
                    End                  = DateTime.Today.AddHours(1),
                    TimeSpanMinutes    = 60,
            };

            var itemId  = await SendAsync(command);
            var itemId2 = await SendAsync(command2);

            var command3 = new UpdateRoomCommand
            {
                RoomId         = itemId,
                Name       = "Room new Name Test2",
                AutoRelease = 40,
            };
            var itemId3 = await SendAsync(command3);
            var newRoom = await FindRoom(itemId);
            newRoom.Name.Should().Be("Room new Name Test2");
            newRoom.RoomSettings.AutoRelease.Should().Be(40);

            var command4 = new DeleteRoomCommand
            {
                Id = itemId,
            };
            var itemId4 = await SendAsync(command4);
            
            var item = await FindAsync<Room>(itemId);

            item.Should().BeNull();
        }
    }
}