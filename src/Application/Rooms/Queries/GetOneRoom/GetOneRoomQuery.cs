using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using booking.Application.Rooms.Commands;
using booking.Application.Rooms.Queries.GetRoomNamelist;
using booking.Application.Rooms.Queries.GetRoomNameList;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Rooms.Queries.GetOneRoom
{
    [MediatrInject(
        MediatrServiceType.ApplicationDbContext,
        MediatrServiceType.BookingAction,
        MediatrServiceType.HashIdService)
    ]
    public class GetOneRoomQuery : IRequest<CreateUpdateRoomDto>
    {
        public int RoomId { get; set; }
    }

    public partial class GetOneRoomQueryHandler
    {
        public async Task<CreateUpdateRoomDto> Handle(GetOneRoomQuery request,
            CancellationToken ct)
        {
            List<Room> listroom = await _applicationDbContext.Rooms.Where(r => r.Id == request.RoomId)
                .Include(i => i.RoomExtraInfoFields)
                .Include(r => r.RoomSettings)
                .ThenInclude(v => v.BookingPeriods)
                .AsNoTracking()
                .ToListAsync(ct);

            IEnumerable<CreateUpdateRoomDto> res = listroom.Select(r => new CreateUpdateRoomDto()
            {
                RoomId = r.Id,
                Name = r.Name,
                ShortName = r.ShortName,
                ChineseName = r.ChineseName,
                MappingKey = r.MappingKey,
                Start = r.RoomSettings.BookingPeriods.First().StartTime,
                End = r.RoomSettings.BookingPeriods.First().EndTime,
                TimeSpanMinutes = (int)r.RoomSettings.BookingPeriods.First().Interval.TotalMinutes,
                BookingUserModeId = (int)r.RoomSettings.BookingUserMode,
                AutoRelease = r.RoomSettings.AutoRelease,
                Disabled = r.RoomSettings.Disabled,
                DefaultBookingTypeId = (int)r.RoomSettings.DefaultBookingType,
                InAdvanceDay = r.RoomSettings.InAdvanceDay,
                RoomExtraInfoFields = r.RoomExtraInfoFields,
            });

            if (res.Any())
            {
                return res.First();
            }

            return null;
        }
    }
}