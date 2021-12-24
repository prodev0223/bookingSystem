using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Rooms.Queries.GetRoomNameList;
using booking.Application.RoomSets.Queries.GetMyRoomSets;
using booking.Application.RoomSets.Queries.GetOneRoomSet;
using booking.Domain.Entities;
using booking.Domain.Enums;
using FluentEmail.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Rooms.Queries.GetMyRoomList
{
    [MediatrInject(MediatrServiceType.ApplicationDbContext, MediatrServiceType.HashIdService,
        MediatrServiceType.CurrentUserService)]
    public class GetMyRoomListQueries : IRequest<IEnumerable<RoomNameListDto>>
    {
    }

    public partial class GetMyRoomListQueriesHandler
    {
        public async Task<IEnumerable<RoomNameListDto>> Handle(GetMyRoomListQueries request,
            CancellationToken ct)
        {
            var goodPermission = new[]
            {
                UserPermission.BookingMakeAnyTime,
                UserPermission.BookingMakeFixedTime,
                UserPermission.AllPermission
            };
            var userId = _currentUserService.UserId;
            List<UserGroup> userGroups = await _applicationDbContext.UserGroupApplicationUsers
                
                    .Include(r => r.UserGroup)
                    .ThenInclude(r => r.UserRoles)
                    .ThenInclude(r => r.PermissionSet)
                    .Include(r => r.UserGroup)
                    .ThenInclude(r => r.UserRoles)
                    .ThenInclude(r => r.RoomSet)
                    .ThenInclude(r => r.Rooms)
                    .ThenInclude(rr => rr.RoomExtraInfoFields)
                    .Where(r => r.ApplicationUserId == userId)
                    .Select(r => r.UserGroup)
                    .ToListAsync(ct);
            List<Room> rooms = new List<Room>();
            var hasAllRoom = false;
            foreach (var userGroup in userGroups)
            {
                if (hasAllRoom)
                {
                    break;
                }
                foreach (var userRole in userGroup.UserRoles)
                {
                    var havePermissions = userRole.PermissionSet.Permissions.Any(i => goodPermission.Contains(i));
                    if (havePermissions)
                    {
                        if (!userRole.RoomSet.AllRooms)
                        {
                            rooms.AddRange(userRole.RoomSet.Rooms);
                        }
                        else
                        {
                            hasAllRoom = true;
                            break;
                        }
                    }
                }
            }

            if (hasAllRoom)
            {
                rooms = await _applicationDbContext.Rooms.ToListAsync(ct);
            }
            
            IEnumerable<RoomNameListDto> res = rooms.Distinct().Select(r => new RoomNameListDto
            {
                Id = r.Id,
                IdCode = _hashIdService.Encode(r.Id),
                Name = r.Name,
                ShortName = r.ShortName,
                ChineseName = r.ChineseName,
                MappingKey = r.MappingKey,
                RoomExtraInfoFields = r.RoomExtraInfoFields,
            });

            return res;
        }
    }
}