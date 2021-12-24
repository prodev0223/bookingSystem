using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using booking.Application.RoomSets.Commands.CreateRoomSet;
using booking.Application.UserGroups.Commands;
using booking.Application.UserGroups.Queries;
using booking.Application.UserPermissions.Commands.CreatePermissionSet;
using booking.Application.UserRoles.Commands.CreateUserRole;
using booking.Application.UserRoles.Queries;
using booking.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.UserGroups
{
    using static Testing;
    public class UpdateUserGroup : TestBase
    {
        [Test]
        public async Task ShouldUpdateUserGroup()
        {
            var userId = await RunAsAdministratorAsync();
            GetAllUserRoles getAllUserRoles = new();
            var roles = await SendAsync(getAllUserRoles);
            roles.Count().Should().Be(1);
            GetAllUserGroups getAllUserGroup = new();
            var userGroups = await SendAsync(getAllUserGroup);
            userGroups.Count().Should().Be(1);
            
            CreateUserGroupCommand createUserGroupCommand = new();
            createUserGroupCommand.Name = "User Group from Unit Test";
            createUserGroupCommand.UserIds = new List<string>() { userId };
            int oldGroupId = roles.First().Id;
            createUserGroupCommand.UserRoleIds = new int[] { oldGroupId };
            var newUserId = await SendAsync(createUserGroupCommand);
            newUserId.Should().BeGreaterThan(0);

            var newPermissionId = await SendAsync(new CreatePermissionSetCommand(){Name = "F", AllPermission = true});
            var newRoomSetId = await SendAsync(new CreateRoomSetCommand()
                { AllRoom = true, Name = "RoomSet form unit test" });


            CreateUserRoleCommand createUserRoleCommand = new();
            createUserRoleCommand.Name = "User Role from Unit Test";
            createUserRoleCommand.RoomSetId = newRoomSetId;
            createUserRoleCommand.PermissionSetId = newPermissionId;
            
            var newUserRoleId = await SendAsync(createUserRoleCommand);
            
            getAllUserGroup = new();
            userGroups = await SendAsync(getAllUserGroup);
            userGroups.Count().Should().Be(2);
            
            UpdateUserGroupCommand updateUserGroupCommand = new();
            updateUserGroupCommand.Id = userGroups.First().Id;
            updateUserGroupCommand.UserRoleIds = new List<int>() { newUserRoleId };
            var userGroupId = await SendAsync(updateUserGroupCommand);
            var userGroupd = await FindAsync<UserGroup>(userGroupId);
            userGroupd.Should().NotBeNull();

            GetUserGroupById getUserGroupById = new();
            getUserGroupById.Id = userGroupId;
            var newUserGroup = await SendAsync(getUserGroupById);
            newUserGroup.UserRoles.First().Id.Should().Be(newUserRoleId);
            //userGroupd.UserRoles.Count().Should().Be(1);
            //query.Id
            // var roles = await SendAsync(query);
            // roles.Count().Should().Be(1);
        }
    }
}