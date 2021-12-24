using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace booking.Application.Bookings.Queries.GetDummyBookings
{
    public class GetDummyBookings : IRequest<IEnumerable<BookingEvent>>
    {
    }

    public class GetDummyBookingsHandler : IRequestHandler<GetDummyBookings, IEnumerable<BookingEvent>>
    {
        public async Task<IEnumerable<BookingEvent>> Handle(GetDummyBookings  request,
                                                                 CancellationToken cancellationToken)
        {
            var res = from i in Enumerable.Range(1, 20)
                      select new BookingEvent
                      {
                          Id         = i,
                          resourceid = 'A',
                          Start      = DateTime.Now.AddDays(i).ToString("u"),
                          End        = DateTime.Now.AddDays(i).AddHours(2).ToString("u"),
                      };

            return res;
        }
    }
}