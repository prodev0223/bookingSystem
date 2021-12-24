using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace booking.Application.Bookings.Queries
{
    [MediatrInject(MediatrServiceType.Logger, MediatrServiceType.CurrentUserService,
        MediatrServiceType.ApplicationDbContext)]
    public class GetMarkedAsClosedCommand : IRequest<IEnumerable<Booking>>
    {
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
    }

    public partial class GetMarkedAsClosedCommandHandler
    {
        public async Task<IEnumerable<Booking>> Handle(GetMarkedAsClosedCommand request,
            CancellationToken cancellationToken)
        {
            _logger.Log(LogLevel.Critical, "Test Critical");
            var query = _applicationDbContext.Bookings
                .Include(b => b.Room)
                .Include(b => b.BookingDetails)
                .Where(b => b.BookingType == BookingType.Closed);

            if (request.From is not null)
            {
                query = query.Where(b => b.Start >= ((DateTime)request.From));
            }

            if (request.To is not null)
            {
                query = query.Where(b => b.End <= ((DateTime)request.To));
            }

            var bookingLs = await query.ToListAsync(cancellationToken);

            return bookingLs;
        }
    }
}
