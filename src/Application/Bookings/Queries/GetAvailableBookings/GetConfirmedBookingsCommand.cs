using booking.Application.Common.Attributes;
using booking.Application.Common.Converters;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace booking.Application.Bookings.Queries.GetAvailableBookings
{
    [MediatrInject(MediatrServiceType.DateTimeService, MediatrServiceType.HashIdService, MediatrServiceType.ApplicationDbContext
    , MediatrServiceType.CurrentUserService
    )]
    public class GetConfirmedBookingsCommand : IRequest<IEnumerable<SimpleBookingDto>>
    {
        public IList<int> RoomIds { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }

    public partial class GetConfirmedBookingsCommandHandler
    {
        public async Task<IEnumerable<SimpleBookingDto>> Handle(GetConfirmedBookingsCommand request, CancellationToken cancellationToken)
        {
            var rids = request.RoomIds;

            List<Room> roomEntities = await _applicationDbContext
                                           .Rooms.Include(r => r.RoomSettings).ThenInclude(x => x.BookingPeriods)
                                           .Where(r => rids.Contains(r.Id)).ToListAsync(cancellationToken);

            IEnumerable<SimpleBookingDto> res = Enumerable.Empty<SimpleBookingDto>();
            request.Start = DateTime.SpecifyKind(request.Start, DateTimeKind.Local);
            request.End = DateTime.SpecifyKind(request.End, DateTimeKind.Local);
            foreach (Room one in roomEntities)
            {
                var temp = await ComputeResult(request.Start, request.End, one, one.Id, cancellationToken);
                res = res.Concat(temp);
            }

            return res;
        }

        public async Task<IEnumerable<SimpleBookingDto>> GetExisting(DateTime start, DateTime end, Room rm,
                                                                     CancellationToken token)
        {
            var curUid = _currentUserService.UserId;
            var list = await _applicationDbContext.Bookings.Include(b => b.BookingDetails).
                Include(b => b.BookingApplicationUser)
                .Where(booking => booking.Start < end &&
                                                                booking.End > start && booking.RoomId == rm.Id &&
                                                                booking.BookingStatus != BookingStatus.Cancelled &&
                                                                booking.BookingStatus != BookingStatus.Rejected &&
                                                                booking.BookingStatus != BookingStatus.NoShow)
                                     .ToListAsync(token);

            var res = list.Select(i => new SimpleBookingDto()
            {
                Editable = i.BookingApplicationUser.Any(i => i.ApplicationUserId == curUid),
                Viewable = true,
                Start = i.Start,
                End = i.End,
                InfoCode = "",
                ResourceId = (int)i.RoomId,
                RoomId = (int)i.RoomId,
                Status = i.BookingStatus,
                Title = i.BookingDetails.Description,
                BookingType = i.BookingType,
                BookingId = i.BookingDetailsId,
            });
            return res;
        }

        public async Task<IEnumerable<SimpleBookingDto>> ComputeResult(DateTime start, DateTime end, Room rm,
                                                                       int rmInt,
                                                                       CancellationToken token)
        {
            start = start.Date;
            TimeZoneInfo cstZone = TimeZoneInfo.Local;
            end = end.Date.AddDays(1);

            IEnumerable<SimpleBookingDto> existing = await GetExisting(start, end, rm, token);

            if (existing != null)
            {
                existing = existing.OrderBy(e => e.Start).ToList();
            }

            return existing;
        }
    }
}