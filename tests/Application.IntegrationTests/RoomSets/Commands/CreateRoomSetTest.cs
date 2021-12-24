using System;
using System.Threading.Tasks;
using booking.Application.Common.Exceptions;
using booking.Application.Rooms.Commands.CreateRooms;
using booking.Application.RoomSets.Commands.CreateRoomSet;
using booking.Application.TodoLists.Commands.CreateTodoList;
using booking.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.RoomSets.Commands
{
    using static Testing;

    public class CreateRoomSetTest : TestBase
    {
        [Test]
        public void ShouldRequireMinimumFields()
        {
            var command = new CreateRoomSetCommand();

            FluentActions.Invoking(() =>
                                       SendAsync(command)).Should().Throw<ValidationException>();
        }

        [Test]
        public async Task ShouldRequireUniqueTitle()
        {
            
            var userId = await RunAsAdministratorAsync();

            await SendAsync(new CreateRoomSetCommand
            {
                Name = "RoomForBiology"
            });

            var command = new CreateRoomSetCommand
            {
                Name = "RoomForBiology"
            };

            FluentActions.Invoking(() =>
                                       SendAsync(command)).Should().Throw<ValidationException>();
        }

        [Test]
        public async Task ShouldCreateRoomSet()
        {
            var userId = await RunAsAdministratorAsync();

            var command = new CreateRoomSetCommand
            {
                Name = "RoomsetBiology",
                AllRoom = false,
            };

            var id = await SendAsync(command);

            var list = await FindAsync<RoomSet>(id);

            list.Should().NotBeNull();
            list.Name.Should().Be(command.Name);
            list.CreatedBy.Should().Be(userId);
            list.Created.Should().BeCloseTo(DateTime.Now, 10000);
        }
        
        [Test]
        public async Task ShouldCreateRoomSetTest()
        {
            var userId = await RunAsAdministratorAsync();

            var command = new CreateRoomSetCommand
            {
                Name = "RoomsetBiology",
                AllRoom = false,
            };

            var id = await SendAsync(command);

            var list = await FindAsync<RoomSet>(id);

            list.Should().NotBeNull();
            list.Name.Should().Be(command.Name);
            list.CreatedBy.Should().Be(userId);
            list.Created.Should().BeCloseTo(DateTime.Now, 10000);
        }
    }
}