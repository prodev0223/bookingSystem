using System.Collections.Generic;
using System.Threading.Tasks;
using booking.Application.Bookings.Queries.GetDummyBookings;
using FluentEmail.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace booking.WebUI.Controllers
{
    [Authorize]
    public class TestBookingsController : ApiControllerBase
    {
        [HttpGet]
        [Route("SimpleDummy")]
        public async Task<IEnumerable<BookingEvent>> Welcome3()
        {
            var command = new GetDummyBookings();
            return await Mediator.Send(command);
        }
    }
}