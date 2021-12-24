using System.Threading.Tasks;
using booking.Application.Bookings.Queries.GetOne;
using booking.Application.Common.Exceptions;
using FluentAssertions;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.Bookings.Queries
{
    using static Testing;

    [TestFixture]
    public class GetOneTest : TestBase
    {
        [Test]
        public async Task ShouldNotGetBookingInfo()
        {
            var userId = await RunAsAdministratorAsync();

            var command = new GetOneCommand
            {
                BookingIdCode = "",
            };

            FluentActions.Invoking(() =>
                                       SendAsync(command)).Should().Throw<ValidationException>();
        }

        [Test]
        public async Task ShouldGetBookingInfo()
        {
            var userId = await RunAsAdministratorAsync();

            int n = 100;
            await MakeRooms(n);

            var command = new GetOneCommand
            {
                BookingIdCode = "",
            };

            FluentActions.Invoking(() =>
                                       SendAsync(command)).Should().Throw<ValidationException>();
        }
    }
}