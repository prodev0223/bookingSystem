using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Rooms.Queries.GetRoomNameList;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Rooms.Queries.GetRoomNamelist
{
    [MediatrInject(MediatrServiceType.ApplicationDbContext, MediatrServiceType.Mapper, MediatrServiceType.HashIdService)]
    
    public class GetRoomNameListQuery : IRequest<IEnumerable<RoomNameListDto>>
    {
    }

    public partial class GetRoomNameListQueryHandler
    {
        public async Task<IEnumerable<RoomNameListDto>> Handle(GetRoomNameListQuery request,
                                                               CancellationToken    cancellationToken)
        {
            List<Room> listroom = await _applicationDbContext.Rooms
                .Include(x => x.RoomExtraInfoFields)
                .Include(r => r.RoomSettings)
                .ThenInclude(x => x.BookingPeriods)
                .AsNoTracking().ToListAsync(cancellationToken);

            IEnumerable<RoomNameListDto> res = listroom.Select(r => new RoomNameListDto
            {
                RoomExtraInfoFields = r.RoomExtraInfoFields,
                Id             = r.Id,
                Name           = r.Name,
                ShortName      = r.ShortName,
                ChineseName    = r.ChineseName,
                MappingKey     = r.MappingKey,
                Start = DateTime.SpecifyKind(r.RoomSettings.BookingPeriods[0].StartTime, DateTimeKind.Local),
                End = DateTime.SpecifyKind(r.RoomSettings.BookingPeriods[0].EndTime, DateTimeKind.Local),
            });

            return res;
        }
    }
}