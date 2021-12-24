using System;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using FluentValidation;

namespace booking.Application.Bookings.Queries.GetAvailableBookings
{
    public class GetAvailableBookingsCommandValidator : AbstractValidator<GetAvailableBookingCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IHashIdService        _hashIdService;

        public GetAvailableBookingsCommandValidator(IApplicationDbContext context, IHashIdService hashIdService)
        {
            _context = context;

            _hashIdService = hashIdService;
            //RuleForEach(v => v.RoomIdCodes).MustAsync(GoodHash).WithMessage("Wrong Room ID");
        }
    }
}