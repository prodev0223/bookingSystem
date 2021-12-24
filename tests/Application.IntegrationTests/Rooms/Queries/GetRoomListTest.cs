using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using booking.Application.Common.Exceptions;
using booking.Application.Rooms.Commands.CreateRooms;
using booking.Application.Rooms.Queries.GetMyRoomList;
using booking.Application.Rooms.Queries.GetRoomNamelist;
using booking.Application.Rooms.Queries.GetRoomNameList;
using booking.Application.RoomSets.Commands.CreateRoomSet;
using booking.Application.RoomSets.Queries.GetOneRoomSet;
using booking.Application.UserPermissions.Commands.CreatePermissionSet;
using booking.Application.UserPermissions.Queries.GetPermissionNameList;
using booking.Application.UserRoles.Commands.CreateUserRole;
using booking.Domain.Entities;
using booking.Domain.Enums;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.Rooms.Queries
{
    using static Testing;

    public class GetRoomListTest : TestBase
    {
        [Test]
        public void ShouldNotCreateRoom()
        {
            var command = new GetRoomNameListQuery();

            FluentActions.Invoking(() =>
                                       SendAsync(command)).Should().NotThrow<ValidationException>();
        }

        [Test]
        public async Task ShouldCreateManyRooms()
        {
            await RunAsAdministratorAsync();
            int n = 100;
            await MakeRooms(n);

            IEnumerable<RoomNameListDto> roomIds = await SendAsync(new GetRoomNameListQuery());

            var setid = await SendAsync(new CreateRoomSetCommand
            {
                Name    = "Room Set 1",
                AllRoom = false,
                RoomIds = roomIds.Select(r => r.Id).ToList(),
            });

            var setid2 = await MakeRoomSet(2, roomIds.Select(r => r.Id).Take(30));

            //roomset2.Rooms.Count.Should().Be(30);

            RoomSetDto roomSetDto2 = await SendAsync(new GetOneRoomSetQuery {SetID = setid2});
            roomSetDto2.RoomIds.Count.Should().Be(30);

            int resCount = await CountAsync<Room>();

            int resSetCount = await CountAsync<RoomSet>();
            resCount.Should().Be(n);
            resSetCount.Should().Be(3);

            //RoomSetDto roomSetDto = await SendAsync(new GetOneRoomSetQuery {SetID = setid});
            //roomSetDto.RoomSimpleDtos.Count.Should().Be(n);

            IEnumerable<UserPermissionDto> permissionDtos = await SendAsync(new GetPermissionListQuery());

            UserPermissionDto allPermission = permissionDtos.Where(r => r.Name.Contains("AllP")).First();

            int perSetId = await SendAsync(new CreatePermissionSetCommand
            {
                Name        = "All permission",
                Permissions = new List<int> {allPermission.Id}
            });

            var createUserRoleCommand = new CreateUserRoleCommand
            {
                Name            = "user Role test",
                PermissionSetId = perSetId,
            };
            int userRoleId = await SendAsync(createUserRoleCommand);

            //var rmset = FindAsync<RoomSet>(setid);
            var list = await SendAsync(new GetMyRoomListQueries());
            //list.Count().Should().Be(n);
        }


        [Test]
        public async Task ShouldCreateRoom()
        {
            var userId = await RunAsAdministratorAsync();

            var roomsetting  = new RoomSettings();
            var roomsetting2 = new RoomSettings();

            var command = new CreateRoomCommand
            {
                Name            = "Room Name Test",
                Start           = DateTime.Today,
                End             = DateTime.Today.AddHours(1),
                TimeSpanMinutes = 60,
            };

            var command2 = new CreateRoomCommand
            {
                Name            = "Room Name Test2",
                Start           = DateTime.Today,
                End             = DateTime.Today.AddHours(1),
                TimeSpanMinutes = 60,
            };

            var itemId  = await SendAsync(command);
            var itemId2 = await SendAsync(command2);
        }
    }
}