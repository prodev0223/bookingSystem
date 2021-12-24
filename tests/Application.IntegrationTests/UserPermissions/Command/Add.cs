using System.Collections.Generic;
using booking.Application.TodoLists.Queries.GetTodos;
using booking.Domain.Entities;
using booking.Domain.ValueObjects;
using FluentAssertions;
using NUnit.Framework;
using System.Linq;
using System.Threading.Tasks;
using booking.Application.UserPermissions.Commands.CreatePermissionSet;
using booking.Application.UserPermissions.Commands.UpdatePermissionSet;
using booking.Application.UserPermissions.Queries.GetPermissionNameList;

namespace booking.Application.IntegrationTests.UserPermissions.Command
{
    using static Testing;
    
    public class Add : TestBase
    {
        [Test]
        public async Task ShouldAddPermission()
        {
            await RunAsAdministratorAsync();
            GetPermissionListQuery query = new();
            var list = await SendAsync(query);
            var tarName = "Unit permissionSet3";
            list.Count().Should().BeGreaterThan(0);
            CreatePermissionSetCommand cmd = new()
            {
                Name = tarName,
                Permissions = new List<int>() { list.First().Id }
            };

            int pid = await SendAsync(cmd);
            var permissionSet = await FindAsync<PermissionSet>(pid);
            permissionSet.Name.Should().Be(tarName);
            permissionSet.Permissions.Count().Should().Be(permissionSet.Permissions.Count);
            
            var newTarName = "New Unit name";
            UpdatePermissionSetCommand cmd2 = new();
            cmd2.Id = pid;
            cmd2.Name = newTarName;
            cmd2.Permissions = new List<int> { list.First().Id, list.Skip(1).First().Id };
            
            var newId = await SendAsync(cmd2);
            newId.Should().Be(pid);
            
            permissionSet = await FindAsync<PermissionSet>(pid);
            permissionSet.Name.Should().Be(newTarName);
            permissionSet.Permissions.Count().Should().Be(2);
        }

        [Test]
        public async Task ShouldUpdatePermission()
        {
            //await RunAsAdministratorAsync();
            //

            //IEnumerable<UserPermissionDto> result = await SendAsync(query);
            //
            //CreatePermissionSetCommand cmd = new()
            //{
            //    Name = "Unit UserName",
            //    Permissions = result.Where(r => r.Name.Contains("AllP")).Select(r => r.Value).ToList(),
            //};

            //int id = await SendAsync(cmd);
            //var res = FindAsync<PermissionSet>(id);
            //res.Should().NotBeNull();
        }
    }
}
