using System.Linq;
using System.Threading.Tasks;
using booking.Application.UserGroups.Queries;
using FluentAssertions;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.UserGroups
{
    using static Testing;
    public class GetAllUserGroup : TestBase
    {
        [Test]
        public async Task ShouldGetAllUserGroup()
        {
            var userId = await RunAsAdministratorAsync();
            GetAllUserGroups query = new();
            var roles = await SendAsync(query);
            roles.Count().Should().Be(1);
        }
    }
}
