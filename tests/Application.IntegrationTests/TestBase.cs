using NUnit.Framework;
using System.Threading.Tasks;
using booking.Application.Rooms.Commands.CreateRooms;

namespace booking.Application.IntegrationTests
{
    using static Testing;

    public class TestBase
    {
        [SetUp]
        public async Task TestSetUp()
        {
            await ResetState();
        }
    }
}
