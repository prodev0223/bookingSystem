using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Bookings.Commands.Create;
using booking.Application.Common.Attributes;
using booking.Application.Common.Converters;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;

namespace booking.Application.Bookings.Commands.Cancel
{
    [MediatrInject(
        MediatrServiceType.BookingAction,
        MediatrServiceType.CurrentUserService,
        MediatrServiceType.ApplicationDbContext,
        MediatrServiceType.IdentityService,
        MediatrServiceType.HashIdService)
    ]
    [Permission( UserPermission.BookingModifyCancel)]
    public class CancelCommand : IRequest<bool>
    {
        public int BookingId { get; set; }
        public string Reason { get; set; }
        //public int RoomId { get; set; }
    }
    public partial class CancelCommandHandler
    {
        public async Task<bool> Handle(CancelCommand request, CancellationToken cancellationToken)
        {
            var res = await _bookingAction.CancelAsync(request.BookingId, cancellationToken);

            return res.Succeeded;
        }
    }
}