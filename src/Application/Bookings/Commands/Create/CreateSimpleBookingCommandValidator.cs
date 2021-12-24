using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.BookingChecker;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Models;
using booking.Domain.Enums;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Bookings.Commands.Create
{
    public class
        CreateSimpleBookingCommandValidatorAutoGenPermissionCheck : AbstractValidator<CreateSimpleBookingCommand>
    {
        private readonly IApplicationDbContext _applicationDbContext;

        //private readonly ICurrentUserService _currentUserService;
        private readonly IIdentityService _identityService;
        private readonly IBookingRule _bookingRule;

        public CreateSimpleBookingCommandValidatorAutoGenPermissionCheck(IIdentityService identityService,
            IApplicationDbContext applicationDbContext, ICurrentUserService currentUserService,
            IBookingRule bookingRule
        )
        {
            _bookingRule = bookingRule;
            _applicationDbContext = applicationDbContext;
            //    _currentUserService = currentUserService;
            _identityService = identityService;
            RuleFor(v => v).MustAsync(HavePermission).WithMessage("Wrong HavePermission");
        }

        public async Task<bool> HavePermission(CreateSimpleBookingCommand a, CancellationToken cancellationToken)
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