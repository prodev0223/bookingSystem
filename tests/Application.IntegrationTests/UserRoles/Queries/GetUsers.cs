using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using booking.Application.UserPermissions.Commands.CreatePermissionSet;
using booking.Application.UserPermissions.Queries.GetPermissionNameList;
using booking.Application.UserRoles.Queries.GetMyRoles;
using booking.Application.Users.Queries.GetUsers;
using booking.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.UserRoles.Queries
{
    using static Testing;
    public class GetUsers : TestBase
    {
        [Test]
        public async Task ShouldGetUserList()
        {
            var uid = await RunAsAdministratorAsync();

            GetAllUsers query = new();

            IEnumerable<SimpleUser> result = await SendAsync(query);
            
            int newSuperAdminCnt = 10;
            List<string> expectedUsers = await MakeSuperAdmin(newSuperAdminCnt);

            result.Count().Should().Be(1);
            
            result = await SendAsync(query);
            result.Count().Should().Be(1 + newSuperAdminCnt);

            expectedUsers.Sort();
            var res2 = expectedUsers[0] == result.First().UserId;
            res2.Should().Be(true);
        }
    }
}
