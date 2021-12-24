using System.Threading.Tasks;
using booking.Application.Bookings.Commands.Cancel;
using FluentAssertions;
using NUnit.Framework;
using ValidationException = booking.Application.Common.Exceptions.ValidationException;

namespace booking.Application.IntegrationTests.Bookings.Commands
{
    using static Testing;
    
    public class CancelBookingTest : TestBase
    {
        [Test]
        public async Task ShouldCannotCancel()
        {
            var uid = await RunAsAdministratorAsync();

            var cancelCommand = new CancelCommand
            {
                BookingId = 0,
            };
            
            FluentActions.Invoking(() =>
                SendAsync(cancelCommand)).Should().Throw<ValidationException>();
        }
        [Test]
        public async Task ShouldCannotCancel2()
        {
            var uid = await RunAsAdministratorAsync();

            var cancelCommand = new CancelCommand
            {
                BookingId = 2,
            };
            FluentActions.Invoking(() =>
                SendAsync(cancelCommand)).Should().Throw<ValidationException>();
        }
    }
}
