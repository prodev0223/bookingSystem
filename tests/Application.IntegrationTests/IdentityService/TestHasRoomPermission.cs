using System.Threading.Tasks;
using booking.Application.Bookings.Commands.Cancel;
using booking.Application.Common.Exceptions;
using booking.Application.Common.Models;
using booking.Application.Rooms.Commands.CreateRooms;
using FluentAssertions;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.IdentityService
{
    using static Testing;
    public class TestHasRoomPermission:TestBase
    {
        
        [Test]
        public async Task ShouldNotCancel()
        {
            var userId = await RunAsAdministratorAsync();
            var command = new CancelCommand();

            FluentActions.Invoking(() =>
                SendAsync(command)).Should().Throw<ValidationException>();
        }
    }
}