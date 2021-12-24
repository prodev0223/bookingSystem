using System.Linq;
using System.Threading.Tasks;
using booking.Application.UserGroups.Queries;
using FluentAssertions;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.UserGroups
{
    using static Testing;
    public class GetUserGroupByIdTest : TestBase
    {
        
        [Test]
        public async Task ShouldGetUserGroupById()
        {
            var userId = await RunAsAdministratorAsync();
            GetUserGroupById query = new() { Id = 10 };
            var roles = await SendAsync(query);
            roles.Should().Be(null);
        }
    }
}