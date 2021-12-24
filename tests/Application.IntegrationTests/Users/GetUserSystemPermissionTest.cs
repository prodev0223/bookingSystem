using System.Linq;
using System.Threading.Tasks;
using booking.Application.UserPermissions.Queries;
using booking.Application.Users.Queries.GetUsers;
using booking.Domain.Enums;
using FluentAssertions;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.Users
{
    using static Testing;

    public class GetUserSystemPermissionTest : TestBase
    {
        [Test]
        public async Task ShouldGetRoleList()
        {
            var uid = await RunAsAdministratorAsync();

            GetMySystemPermissionQuery getMySystemPermissionQuery = new()
            {
            };

            var result2 = await SendAsync(getMySystemPermissionQuery);
            var adminPermission = result2.First().Permissions;
            adminPermission.First().Should().Be(UserPermission.AllPermission);
        }
    }
}