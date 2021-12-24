using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Bookings.Commands.Create;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using booking.Application.Models;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Bookings.Commands.Update
{
    [MediatrInject(
        MediatrServiceType.ApplicationDbContext,
        MediatrServiceType.IdentityService,
        MediatrServiceType.HashIdService,
        MediatrServiceType.CurrentUserService,
        MediatrServiceType.BookingRule,
        MediatrServiceType.BookingService,
        MediatrServiceType.SendEmail
    )]
    public class UpdateSimpleBookingCommand : IRequest<APIResponse>
    {
        public int BookingId { get; set; }
        public int RoomId { get; set; }
        public string Name { get; set; }
        public IList<string> Names { get; set; }
        public BookingDetailDto BookingDetailDto { get; set; } = new BookingDetailDto();
        public DateTime Date { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public BookingType BookingType { get; set; }
    }

    public partial class UpdateSimpleBookingCommandHandler
    {
        public async Task<APIResponse> Handle(UpdateSimpleBookingCommand request, CancellationToken cancellationToken)
        {
            APIResponse response = new APIResponse(MESSAGE.UPDATED);

            try
            {
                DateTime start = request.StartTime;
                start = start.ToLocalTime();

                DateTime end = request.EndTime;
                end = end.ToLocalTime();

                int roomID = request.RoomId;

                var list = await _applicationDbContext.Bookings.Where(
                        booking => booking.Start < end &&
                                   booking.End > start &&
                                   booking.RoomId == roomID &&
                                   booking.BookingStatus !=
                                   BookingStatus.Cancelled &&
                                   booking.BookingStatus !=
                                   BookingStatus.Rejected &&
                                   booking.BookingStatus !=
                                   BookingStatus.NoShow && booking.Id != request.BookingId)
                    .ToListAsync(cancellationToken);

                if (list.Any())
                {
                    response.UpdateStatus(MESSAGE.UPDATE_FAILED);
                    response.Message = "Overlapped with existing booking";
                }

                var (weekStart, weekEnd) = _bookingRule.GetFullWeekRange(start, end);
                var sameWeekSameRoomCnt = _applicationDbContext.Bookings
                    .Include(b => b.BookingApplicationUser.Where(i => i.ApplicationUserId == _currentUserService.UserId))
                    .Count(
                        booking => booking.Start >= weekStart && booking.End <= weekEnd &&
                                   booking.RoomId == roomID &&
                                   (
                                       booking.BookingStatus == BookingStatus.Confirmed ||
                                       booking.BookingStatus == BookingStatus.Finished
                                   )
                    );

                var inWeekLimit = _bookingRule.WithinLimitPerWeek(roomID, sameWeekSameRoomCnt - 1);
                if (!inWeekLimit)
                {
                    response.UpdateStatus(MESSAGE.UPDATE_FAILED);
                    response.Message = "Over weekly booking limit";
                }

                BookingType bookingType = BookingType.UserWithCard;
                if (request.BookingType == BookingType.Closed)
                {
                    bookingType = BookingType.Closed;
                }

                Booking b = new()
                {
                    BookingType = bookingType,
                    BookingStatus = BookingStatus.Confirmed,
                    RoomId = roomID,
                    Start = start,
                    End = end,
                    BookingDetails = new BookingDetails
                    {
                        Description = request.BookingDetailDto.Description,
                        Equipments =
                            request.BookingDetailDto.EquipmentsID.Select(e =>
                            {
                                var t = _hashIdService.Decode(e);
                                if (t.Length > 0)
                                {
                                    return new Equipment
                                    {
                                        ID = t[0]
                                    };
                                }

                                return null;
                            }).Where(i => i != null).ToList(),
                    }
                };

                await _bookingService.UpdateBookings(request.BookingId, b, cancellationToken);

                await _sendEmail.BookingChanged(request.BookingId, cancellationToken);

                response.AnyData = b.Id;
            }
            catch (Exception Ex)
            {
                response.Message = Ex.Message;
                response.UpdateStatus(MESSAGE.UPDATE_FAILED);
            }

            return response;
        }
    }
}