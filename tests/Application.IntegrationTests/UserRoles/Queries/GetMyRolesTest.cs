using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using booking.Application.UserPermissions.Commands.CreatePermissionSet;
using booking.Application.UserPermissions.Queries.GetPermissionNameList;
using booking.Application.UserRoles.Queries.GetMyRoles;
using booking.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.UserRoles.Queries
{

    using static Testing;
    public class GetMyGroupTest : TestBase
    {
        [Test]
        public async Task ShouldGetRoleList()
        {
            var uid = await RunAsAdministratorAsync();

            GetMyGruopQuery query = new();

            IEnumerable<UserGroup> result = await SendAsync(query);

            result.Count().Should().Be(1);
        }
    }
}