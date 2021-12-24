using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Rooms.Queries.GetRoomNameList;
using booking.Application.RoomSets.Queries.GetOneRoomSet;
using booking.Domain.Entities;
using booking.Domain.Enums;
using FluentEmail.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace booking.Application.RoomSets.Queries.GetMyRoomSets
{
    [MediatrInject(
            MediatrServiceType.Logger,
            MediatrServiceType.Mapper,
            MediatrServiceType.ApplicationDbContext,
            MediatrServiceType.CurrentUserService
        )
    ]
    public class GetMyRoomSetsQuery : IRequest<IEnumerable<RoomSetDto>>
    {
    }

    public partial class GetMyRoomSetsQueryHandler
    {
        public async Task<IEnumerable<RoomSetDto>> Handle(GetMyRoomSetsQuery   request,
                                             CancellationToken cancellationToken)
        {
            var roomSetQuery =
                _applicationDbContext.AppUserRoles
                    .Include( u => u.RoomSet)
                    .ThenInclude(r => r.Rooms).Where(r => r.Id == 1)
                    .Where(u => EF.Property<string>(u, "ApplicationUserId") == _currentUserService.UserId);
#if DEBUG
            _logger.Log(LogLevel.Debug, "SQL" + roomSetQuery.ToQueryString());
#endif
            var roomSet = await roomSetQuery.ToListAsync();

            var roomSetLs = roomSet.Select(r => r.RoomSet);
            return roomSetLs.Select(r => _mapper.Map<RoomSetDto>(r));
        }
    }
}