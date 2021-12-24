using System.Collections.Generic;
using booking.Application.TodoLists.Queries.GetTodos;
using booking.Domain.Entities;
using booking.Domain.ValueObjects;
using FluentAssertions;
using NUnit.Framework;
using System.Linq;
using System.Threading.Tasks;
using booking.Application.UserPermissions.Commands.CreatePermissionSet;
using booking.Application.UserPermissions.Queries.GetPermissionNameList;
using booking.Domain.Enums;

namespace booking.Application.IntegrationTests.UserPermissions.Queries
{
    using static Testing;
    
    public class GetPermissionNameListTest : TestBase
    {
        [Test]
        public async Task ShouldGetNameList()
        {
            GetPermissionListQuery query = new();

            IEnumerable<UserPermissionDto> result = await SendAsync(query);

            result.Count().Should().Be(20);
        }

        [Test]
        public async Task ShouldCreatePermissionSet()
        {
            await RunAsAdministratorAsync();
            
            GetPermissionListQuery query = new();

            IEnumerable<UserPermissionDto> result = await SendAsync(query);
            
            CreatePermissionSetCommand cmd = new()
            {
                Name = "Unit UserName",
                Permissions = new List<int>{(int)UserPermission.AllPermission}
            };

            int id = await SendAsync(cmd);
            var res = FindAsync<PermissionSet>(id);
            res.Should().NotBeNull();
        }
    }
}
