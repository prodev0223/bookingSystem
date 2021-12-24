using System.Threading;
using System.Threading.Tasks;
using booking.Application.Bookings.Queries.GetAvailableBookings;
using booking.Application.Common.Interfaces;
using FluentValidation;

namespace booking.Application.Bookings.Queries.GetOne
{
    public class GetOneCommandValidator : AbstractValidator<GetOneCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IHashIdService        _hashIdService;

        public GetOneCommandValidator(IApplicationDbContext context, IHashIdService hashIdService)
        {
            _hashIdService = hashIdService;
            RuleFor(v => v.BookingIdCode).MustAsync(GoodHash).WithMessage("Wrong Booking ID");
        }

        public async Task<bool> GoodHash(string code, CancellationToken cancellationToken)
        {
            if (code != null)
            {
                var ids = _hashIdService.Decode(code);
                if (ids.Length != 1)
                {
                    return false;
                }
            }

            return true;
        }
    }
}