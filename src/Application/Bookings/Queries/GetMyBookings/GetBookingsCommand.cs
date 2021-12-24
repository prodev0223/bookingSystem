using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Bookings.Queries.GetDummyBookings;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace booking.Application.Bookings.Queries.GetMyBookings
{
    [MediatrInject(MediatrServiceType.Logger, MediatrServiceType.CurrentUserService, MediatrServiceType.ApplicationDbContext)]
    public class GetBookingsCommand : IRequest<IEnumerable<Booking>>
    {
        public int? BookingId { get; set; }
    }

    public partial class GetBookingsCommandHandler
    {
        public async Task<IEnumerable<Booking>> Handle(GetBookingsCommand request,
            CancellationToken cancellationToken)
        {
            IQueryable<Booking> query = _applicationDbContext.Bookings
                .Include(b => b.Room)
                .Include(b => b.BookingDetails);

            if (request.BookingId > 0)
            {
                query = query.Where(b => b.Id == request.BookingId);
            }

            var queryString = query.ToQueryString();
            var bookingLs = await query.OrderByDescending(data => data.Created).ToListAsync(cancellationToken);

            return bookingLs;
        }
    }
}