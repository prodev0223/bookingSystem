using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Bookings.Queries.GetOne;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Bookings.Queries.GetOneById
{
    [Permission(UserPermission.AllPermission)]
    [AutoGenerateValidation]
    [MediatrInject(MediatrServiceType.ApplicationDbContext)]
    public class GetOneByIdCommand : IRequest<Booking>
    {
        public int BookingId { get; set; }
    }

    public partial class GetOneByIdCommandHandler
    {
        public async Task<Booking> Handle(GetOneByIdCommand request, CancellationToken cancellationToken)
        {
            var one = await _applicationDbContext.Bookings
                                    .Include(b => b.BookingDetails.Equipments).Where(b => b.Id == request.BookingId)
                                    .FirstOrDefaultAsync(cancellationToken);
            return one;
        }
        
    }
}