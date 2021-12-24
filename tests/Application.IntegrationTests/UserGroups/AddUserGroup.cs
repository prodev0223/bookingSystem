using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using booking.Application.RoomSets.Commands.CreateRoomSet;
using booking.Application.RoomSets.Queries.GetAllRoomSet;
using booking.Application.UserGroups.Commands;
using booking.Application.UserGroups.Queries;
using booking.Application.UserPermissions.Commands.CreatePermissionSet;
using booking.Application.UserPermissions.Queries.GetPermissionNameList;
using booking.Application.UserPermissions.Queries;
using booking.Application.UserRoles.Commands.CreateUserRole;
using booking.Application.UserRoles.Queries.GetMyRoles;
using booking.Application.Users.Commands;
using booking.Application.Users.Queries.GetUsers;
using booking.Domain.Enums;
using FluentAssertions;
using MediatR;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.UserGroups
{
    using static Testing;
    public class AddUserGroup:TestBase
    {
        [Test]
        public async Task ShouldGetUserGroup()
        {
           var userId = await RunAsAdministratorAsync();
           GetMyGruopQuery query = new();
           var roles = await SendAsync(query);
           roles.Count().Should().Be(1);
        }
        [Test]
        public async Task ShouldGetAddedUserGroup()
        {
           var userId = await RunAsAdministratorAsync();
           
           GetMyGruopQuery query = new();
           var roles = await SendAsync(query);
           roles.Count().Should().Be(1);
           
           var getPermissionList = new GetAllPermissionSetList();
           var permissionSets = await SendAsync(getPermissionList);
           var masterSet = permissionSets.First(r => r.Permissions.Contains(UserPermission.AllPermission));
           
           var getRoomSetList = new GetAllRoomSets();
           var roomSets = await SendAsync(getRoomSetList);
           var masterRoomSet = roomSets.First(r => r.AllRooms == true);

           var createUserRoleCommand = new CreateUserRoleCommand()
           {
               Name = "new Username",
               PermissionSetId = masterSet.Id,
               RoomSetId = masterRoomSet.Id,
           };
           
           var userUserRoleId = await SendAsync(createUserRoleCommand);

           CreateUserGroupCommand cmd = new()
           {
               Name = "Unit test new user group",
               UserRoleIds = new List<int> { userUserRoleId },
               UserIds = new List<string> { userId }
           };
           
           var newUserGroupId = await SendAsync(cmd);
           
           query = new();
           roles = await SendAsync(query);
           roles.Count().Should().Be(2);
        }
        [Test]
        public async Task ShouldGetAddedUserToGroup()
        {
           var userId = await RunAsAdministratorAsync();
           var groupInfo = TestingSeedData.SimpleFixedBookingTimeUserGroup();
           var newGroupId = await AddAsyncReturnId(groupInfo);
           newGroupId.Should().BeGreaterThan(0);
           var createUserSimpleCommand = new CreateUserSimpleCommand
           {
               Username = "username@unittest.com",
               Password = "passwordA!334",
               GroupIds = new []{newGroupId}
           };
           var newUserId = await SendAsync(createUserSimpleCommand);
           newUserId.Should().NotBe("");
           var newUserInfo = await SendAsync(new GetUserinfoCommand(){UserId = newUserId});
           newUserInfo.Count().Should().Be(1);
           newUserInfo.First().Name.Should().Be(groupInfo.Name);
        }
        
        [Test]
        public async Task ShouldAddUserToGroup()
        {
           var userId = await RunAsAdministratorAsync();
           var groupInfo = TestingSeedData.SimpleFixedBookingTimeUserGroup();
           var newGroupId = await AddAsyncReturnId(groupInfo);
           newGroupId.Should().BeGreaterThan(0);
           var createUserSimpleCommand = new CreateUserSimpleCommand
           {
               Username = "username@unittest.com",
               Password = "passwordA!334",
               GroupIds = Enumerable.Empty<int>()
           };
           var newUserId = await SendAsync(createUserSimpleCommand);
           newUserId.Should().NotBe("");

           var addGroupToUserCommand = new AddGroupToUserCommand();
           addGroupToUserCommand.UserId = newUserId;
           addGroupToUserCommand.GroupIds = new List<int> { newGroupId };
           
           await SendAsync(addGroupToUserCommand);
           
           var newUserInfo = await SendAsync(new GetUserinfoCommand{UserId = newUserId});
           newUserInfo.Count().Should().Be(1);
           newUserInfo.First().Name.Should().Be(groupInfo.Name);
        }
    }
}