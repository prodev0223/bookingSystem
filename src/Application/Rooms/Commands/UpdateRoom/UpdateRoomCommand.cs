using System;
using System.Collections.Generic;
using System.Linq;
using booking.Application.Common.Exceptions;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Security;
using booking.Domain;
using booking.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Rooms.Commands.UpdateRoom
{
    // Check is done in UpdateRoomCommandValidator.cs
    [Permission(UserPermission.FacilityManagement)]
    public class UpdateRoomCommand : CreateUpdateRoomDto, IRequest<int>
    {
    }

    public class UpdateRoomCommandHandler : IRequestHandler<UpdateRoomCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public UpdateRoomCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(UpdateRoomCommand request, CancellationToken cancellationToken)
        {
            var roomEntity = await _context.Rooms
                .Include(r => r.RoomSettings)
                .ThenInclude(x => x.BookingPeriods)
                .SingleAsync(
                    i => i.Id == request.RoomId,
                    cancellationToken
                );

            if (roomEntity == null)
            {
                throw new NotFoundException(nameof(Room), request.RoomId);
            }

            var roomSettings = roomEntity.RoomSettings;
            if (request.AutoRelease != 0)
            {
                roomSettings.AutoRelease = request.AutoRelease;
            }

            if (request.Start != DateTime.MinValue && request.End != DateTime.MinValue)
            {
                int intervalMinutes = request.TimeSpanMinutes != 0 ? request.TimeSpanMinutes : 60;
                var startCleaned = request.Start.RemoveSeconds().ToLocalTime();
                var endCleaned = request.End.RemoveSeconds().ToLocalTime();
                roomSettings.BookingPeriods.Clear();
                roomSettings.BookingPeriods = Enumerable.Range(0, 7)
                    .Select(i => new RoomTimeslot
                    {
                        DayOfWeek = (DayOfWeek)i,
                        StartTime = startCleaned,
                        EndTime = endCleaned,
                        Interval = TimeSpan.FromMinutes(intervalMinutes)
                    })
                    .ToList();
            }

            /// Ashok(15-Dec-2021)
            /// 0 is Used for Anyone,So removed this condition to allow update
            //if (request.BookingUserModeId != 0)
            //{
            //    roomSettings.BookingUserMode = (BookingUserMode)request.BookingUserModeId;
            //}
            roomSettings.BookingUserMode = (BookingUserMode)request.BookingUserModeId;

            if (request.DefaultBookingTypeId != 0)
            {
                roomSettings.DefaultBookingType = (BookingType)request.DefaultBookingTypeId;
            }

            if (request.InAdvanceDay != 0)
            {
                roomSettings.InAdvanceDay = request.InAdvanceDay;
            }

            if (request.Name is not null)
            {
                roomEntity.Name = request.Name;
            }

            if (request.ShortName is not null)
            {
                roomEntity.ShortName = request.ShortName;
            }

            if (request.ChineseName is not null)
            {
                roomEntity.ChineseName = request.ChineseName;
            }

            if (request.MappingKey is not null)
            {
                roomEntity.MappingKey = request.MappingKey;
            }

            roomEntity.RoomSettings = roomSettings;
            roomEntity.RoomExtraInfoFields = request.RoomExtraInfoFields.ToList();

            await _context.SaveChangesAsync(cancellationToken);

            return roomEntity.Id;
        }
    }
}