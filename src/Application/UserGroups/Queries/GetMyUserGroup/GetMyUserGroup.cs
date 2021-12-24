using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using booking.Application.Rooms.Queries.GetRoomNameList;
using booking.Application.RoomSets.Queries.GetOneRoomSet;
using booking.Domain.Entities;
using booking.Domain.Enums;
using FluentEmail.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.UserGroups.Queries.GetMyUserGroup
{
    [MediatrInject(
        MediatrServiceType.ApplicationDbContext,
        MediatrServiceType.Mapper,
        MediatrServiceType.CurrentUserService
        )]
    [Permission(UserPermission.BookingViewMyBooking)]
    public class GetMyUserGroup : IRequest<IEnumerable<UserGroup>>
    {
    }

    public partial class GetMyUserGroupHandler 
    {
        public async Task<IEnumerable<UserGroup>> Handle(GetMyUserGroup request, CancellationToken  ct)
        {
            var userId = _currentUserService.UserId;
            var userGroupList =
                await _applicationDbContext.UserGroupApplicationUsers
                    .Include(r => r.UserGroup)
                    .ThenInclude(r => r.UserRoles)
                    .ThenInclude(r => r.PermissionSet)
                    .Include(r => r.UserGroup)
                    .ThenInclude(r => r.UserRoles)
                    .ThenInclude(r => r.RoomSet)
                    .ThenInclude(r => r.Rooms)
                    .Where(r => r.ApplicationUserId == userId)
                    .Select(r => r.UserGroup)
                    .ToListAsync(ct);

            return userGroupList;
        }
    }
}
