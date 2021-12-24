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
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace booking.Application.RoomSets.Queries.GetAllRoomSet
{
    [MediatrInject(
            MediatrServiceType.Logger,
            MediatrServiceType.Mapper,
            MediatrServiceType.ApplicationDbContext,
            MediatrServiceType.CurrentUserService
        )
    ]
    [Permission(UserPermission.FacilityManagement)]
    public class GetAllRoomSets : IRequest<IEnumerable<RoomSet>>
    {
    }

    public partial class GetAllRoomSetsHandler
    {
        public async Task<IEnumerable<RoomSet>> Handle(GetAllRoomSets request,
                                             CancellationToken ct)
        {
            var roomSetQuery =
                _applicationDbContext.RoomSets
                    .Include(u => u.Rooms);
#if DEBUG
            _logger.Log(LogLevel.Debug, "SQL" + roomSetQuery.ToQueryString());
#endif
            var res = await roomSetQuery.ToListAsync(ct);
            return res;
        }
    }
}
