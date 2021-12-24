using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Bookings.Queries.GetDummyBookings;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Bookings.Queries.GetOne
{
    [Permission(UserPermission.AllPermission)]
    public class GetOneCommand : IRequest<Booking>
    {
        public string BookingIdCode { get; set; }
    }

    public class GetOneHandler : IRequestHandler<GetOneCommand, Booking>
    {
        private readonly IApplicationDbContext _context;
        private readonly IHashIdService        _hashIdService;

        public GetOneHandler(IHashIdService hashIdService, IApplicationDbContext dbContext)
        {
            _context = dbContext;

            _hashIdService = hashIdService;
        }

        public async Task<Booking> Handle(GetOneCommand request, CancellationToken cancellationToken)
        {
            int[] ids = _hashIdService.Decode(request.BookingIdCode);

            var one = await _context.Bookings
                                    .Include(b => b.BookingDetails.Equipments).Where(b => b.Id == ids[0])
                                    .FirstOrDefaultAsync(cancellationToken);

            return one;
        }
    }
}