using booking.Application.Common.Exceptions;
using booking.Application.TodoItems.Commands.CreateTodoItem;
using booking.Application.TodoLists.Commands.CreateTodoList;
using booking.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;
using System;
using System.Threading.Tasks;
using booking.Application.Rooms.Commands.CreateRooms;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.IntegrationTests.Rooms.Commands
{
    using static Testing;

    public class CreateRoomTests : TestBase
    {
        [Test]
        public void ShouldNotCreateRoom()
        {
            var command = new CreateRoomCommand();

            FluentActions.Invoking(() =>
                SendAsync(command)).Should().Throw<ValidationException>();
        }

        [Test]
        public async Task ShouldCreateRoom()
        {
            var userId = await RunAsAdministratorAsync();

            var roomsetting = new RoomSettings();
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

            var itemId = await SendAsync(command);
            var itemId2 = await SendAsync(command2);
        }
    }
}
