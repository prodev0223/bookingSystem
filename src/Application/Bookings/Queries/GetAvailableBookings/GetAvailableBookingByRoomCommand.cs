using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Bookings.Commands.Create;
using booking.Application.Common.Attributes;
using booking.Application.Common.Converters;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using booking.Domain.Enums;
using Casbin.AspNetCore.Authorization;
using HashidsNet;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using NetCasbin;

namespace booking.Application.Bookings.Queries.GetAvailableBookings
{
    [MediatrInject(MediatrServiceType.DateTimeService, MediatrServiceType.HashIdService, MediatrServiceType.ApplicationDbContext
    , MediatrServiceType.CurrentUserService
    )]
    public class GetAvailableBookingByRoomCommand : IRequest<SimpleBookingDto>
    {
        public int? RoomId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }

    public partial class GetAvailableBookingByRoomCommandHandler
    {
        public async Task<SimpleBookingDto> Handle(GetAvailableBookingByRoomCommand request,
                                                                CancellationToken cancellationToken)
        {
            DateTime end = request.End;
            DateTime start = request.Start;
            request.Start = request.Start.Date;
            request.End = new DateTime(end.Year, end.Month, end.Day, 23, 55, 0);

            Room roomEntities = await _applicationDbContext
                                           .Rooms.Include(r => r.RoomSettings).ThenInclude(x => x.BookingPeriods)
                                           .Where(r => r.Id == request.RoomId).FirstOrDefaultAsync(cancellationToken);

            SimpleBookingDto res = new SimpleBookingDto();
            request.End = DateTime.SpecifyKind(request.End, DateTimeKind.Local);
            request.Start = DateTime.SpecifyKind(request.Start, DateTimeKind.Local);

            IEnumerable<SimpleBookingDto> temp = await ComputeResult(request.Start, request.End, roomEntities, roomEntities.Id,
                                               cancellationToken);

            if (temp != null)
            {
                res = temp.Where(data => data.Status != BookingStatus.Confirmed).FirstOrDefault();
            }

            return res;
        }

        public static DateTime GetDateAndTime(DateTime date, DateTime time)
        {
            return date.Date + time.TimeOfDay;
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
            //start = TimeZoneInfo.ConvertTimeFromUtc(start, cstZone);
            end = end.Date.AddDays(1);
            //end = TimeZoneInfo.ConvertTimeFromUtc(end, cstZone);

            IEnumerable<SimpleBookingDto> existing = await GetExisting(start, end, rm, token);

            var a = existing.OrderBy(e => e.Start).ToList();

            IEnumerable<SimpleBookingDto> glis = GenPossibleFixedBookings(start, end, rm, rmInt);
            return existing.Concat(GoodGen(a, glis));
        }

        public bool Overlap(SimpleBookingDto a, SimpleBookingDto b)
        {
            return a.End > b.Start && a.Start < b.End;
        }

        public bool Overlap(DateTime s1, DateTime e1, DateTime s2, DateTime e2)
        {
            return e1 > s2 && s1 < e2;
        }

        public IEnumerable<SimpleBookingDto> GoodGen(IList<SimpleBookingDto> a, IEnumerable<SimpleBookingDto> g)
        {
            var an = a.Count;

            var i = 0;
            foreach (var k in g)
            {
                while (i < an && a[i].End <= k.Start)
                {
                    i++;
                }

                if (an == i || !Overlap(a[i], k))
                {
                    yield return k;
                }
            }
        }

        private IEnumerable<SimpleBookingDto> GenPossibleFixedBookings(DateTime start, DateTime end, Room rm, int rmInt)
        {
            for (DateTime lDate = start; lDate < end; lDate = lDate.AddDays(1))
            {
                RoomTimeslot? tdySetting =
                    rm.RoomSettings.BookingPeriods.FirstOrDefault(i => i.DayOfWeek == lDate.DayOfWeek);
                if (tdySetting == null)
                {
                    continue;
                }

                DateTime loopDateTimeIdx = GetDateAndTime(lDate, tdySetting.StartTime);
                DateTime thisDayEndDataTime = GetDateAndTime(lDate, tdySetting.EndTime);
                thisDayEndDataTime = thisDayEndDataTime.AddMinutes(-tdySetting.Interval.TotalMinutes);
                for (var idx = loopDateTimeIdx;
                     idx <= thisDayEndDataTime;
                     idx = idx.AddMinutes(tdySetting.Interval.TotalMinutes))
                {
                    var localstart = idx;
                    var localend = idx.AddMinutes(tdySetting.Interval.TotalMinutes);
                    // Skip finished events
                    if (localend < _dateTimeService.Now)
                    {
                        continue;
                    }

                    var unixstart = UnixTimeConverter.ToUnix(localstart);
                    var unixend = UnixTimeConverter.ToUnix(localend);
                    var infoCode = _hashIdService.Encode(unixstart, unixend, rm.Id);

                    if (rm.RoomSettings.InAdvanceDay == 0 || (localstart - DateTime.Now).TotalDays < rm.RoomSettings.InAdvanceDay)
                    {
                        yield return
                       new SimpleBookingDto
                       {
                           Start = localstart,
                           End = localend,
                           ResourceId = rmInt, // resourceid
                           RoomId = rmInt,
                           InfoCode = infoCode,
                           Title = "Available",
                           Color = "#52c41a",
                           Status = BookingStatus.ForBooking,
                       };
                    }
                }
            }
        }
    }
}