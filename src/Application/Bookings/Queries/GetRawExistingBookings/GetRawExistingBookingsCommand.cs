using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Bookings.Queries.GetRawExistingBookings
{
    public class GetRawExistingBookingsCommand : IRequest<IEnumerable<Booking>>
    {
        public DateTime Start { get; set; }

        public DateTime End { get; set; }
    }

    public class
        GetRawExistingBookingsCommandHandler : IRequestHandler<GetRawExistingBookingsCommand, IEnumerable<Booking>>
    {
        private readonly IApplicationDbContext _context;


        public GetRawExistingBookingsCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Booking>> Handle(GetRawExistingBookingsCommand request,
                                                       CancellationToken             cancellationToken)
        {
            IQueryable<Booking> res =
                _context.Bookings.Where(booking => booking.Start < request.End &&
                                                   booking.End   > request.Start);

            return await res.ToListAsync(cancellationToken);
        }
    }
}