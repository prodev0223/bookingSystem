using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.BookingChecker;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Models;
using booking.Domain.Enums;
using FluentValidation;

namespace booking.Application.Bookings.Commands.Update
{
    public class UpdateSimpleBookingCommandValidator : AbstractValidator<UpdateSimpleBookingCommand>
    {
        private readonly IApplicationDbContext _applicationDbContext;

        //private readonly ICurrentUserService _currentUserService;
        private readonly IIdentityService _identityService;
        private readonly IBookingRule _bookingRule;
        private readonly IBookingService _bookingService;

        public UpdateSimpleBookingCommandValidator(
            IIdentityService identityService,
            IApplicationDbContext applicationDbContext,
            ICurrentUserService currentUserService,
            IBookingRule bookingRule,
            IBookingService bookingService
        )
        {
            _bookingService = bookingService;
            _bookingRule = bookingRule;
            _applicationDbContext = applicationDbContext;
            _identityService = identityService;
            RuleFor(v => v).MustAsync(HavePermission).WithMessage("Wrong HavePermission");
            RuleFor(v => v.BookingId).MustAsync(IsNotPastEvent).WithMessage("It is a past event");
        }

        public async Task<bool> IsNotPastEvent(int bookingId, CancellationToken ct)
        {
            var bookingInfo = await _bookingService.GetBookings(bookingId, ct);
            var isPastEvent = _bookingRule.IsPastEvent(bookingInfo);
            return !isPastEvent;
        }

        public async Task<bool> HavePermission(UpdateSimpleBookingCommand a, CancellationToken cancellationToken)
        {
            var haveBooking = Result.Success();
            a.StartTime = a.StartTime.ToLocalTime();
            a.EndTime = a.EndTime.ToLocalTime();

            var haveRoom = await _identityService.HasRoomPermissionAsync(a.RoomId,
                new[] { UserPermission.BookingMakeFixedTime, UserPermission.BookingMakeAnyTime });

            var validBookingTimeRange = false;
            string errorMsg = "";
            if (haveRoom.Item1.Any(i => i.Key == UserPermission.BookingMakeAnyTime && i.Value))
            {
                validBookingTimeRange =
                    await _bookingRule.IsValidCustomTime(a.RoomId, a.StartTime, a.EndTime, cancellationToken);
                if (!validBookingTimeRange)
                {
                    errorMsg = "InvalidCustomTime";
                }
            }
            else if (haveRoom.Item1[UserPermission.BookingMakeFixedTime])
            {
                validBookingTimeRange =
                    await _bookingRule.IsValidFixedTime(a.RoomId, a.StartTime, a.EndTime, cancellationToken);
                if (!validBookingTimeRange)
                {
                    errorMsg = "InvalidFixedTime";
                }
            }

            if (!validBookingTimeRange)
            {
                throw new Exception(errorMsg);
            }

            var haveSystem = Result.Success();

            return haveSystem.Succeeded &&
                   haveBooking.Succeeded;
        }
    }
}