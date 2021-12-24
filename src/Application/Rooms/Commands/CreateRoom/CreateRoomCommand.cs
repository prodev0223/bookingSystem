using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using booking.Domain;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;

namespace booking.Application.Rooms.Commands.CreateRooms
{
    [Permission(UserPermission.FacilityManagement)]
    public class CreateRoomCommand : CreateUpdateRoomDto, IRequest<int>
    {
    }

    public class CreateRoomCommandHandler : IRequestHandler<CreateRoomCommand, int>
    {
        private readonly IApplicationDbContext _context;


        public CreateRoomCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateRoomCommand request, CancellationToken cancellationToken)
        {

            var startCleaned = request.Start.RemoveSeconds().ToLocalTime();
            var endCleaned = request.End.RemoveSeconds().ToLocalTime();

            int intervalMinutes = request.TimeSpanMinutes != 0 ? request.TimeSpanMinutes : 60;
            var roomSettings = new RoomSettings
            {
                AutoRelease = request.AutoRelease,
                BookingPeriods = Enumerable.Range(0, 7)
                                           .Select(i => new RoomTimeslot
                                           {
                                               DayOfWeek = (DayOfWeek)i,
                                               StartTime = startCleaned,
                                               EndTime = endCleaned,
                                               Interval = TimeSpan.FromMinutes(intervalMinutes),
                                           })
                                           .ToList(),
                BookingUserMode = (BookingUserMode)request.BookingUserModeId,
                DefaultBookingType = (BookingType)request.DefaultBookingTypeId,
                InAdvanceDay = request.InAdvanceDay,
            };
            var rm = new Room
            {
                Name = request.Name,
                ShortName = request.ShortName,
                ChineseName = request.ChineseName,
                MappingKey = request.MappingKey,
                RoomSettings = roomSettings,
                CombinableRooms = new List<int>(),
                RoomExtraInfoFields = request.RoomExtraInfoFields.ToList() //Ashok(29-Nov-2021) - Added to save extra fields
            };

            await _context.Rooms.AddAsync(rm, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);
            return rm.Id;
        }
    }
}