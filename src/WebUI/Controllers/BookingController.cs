using booking.Application.Bookings.Commands.Cancel;
using booking.Application.Bookings.Commands.Create;
using booking.Application.Bookings.Commands.Delete;
using booking.Application.Bookings.Commands.Update;
using booking.Application.Bookings.Queries.GetAvailableBookings;
using booking.Application.Bookings.Queries.GetMyBookings;
using booking.Application.Models;
using booking.Domain.Entities;
using booking.WebUI.Models.Booking;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace booking.WebUI.Controllers
{
    [Authorize]
    public class BookingController : ApiControllerBase
    {
        [HttpPost]
        [Route("[action]")]
        public async Task<IEnumerable<SimpleBookingDto>> GetList(GetBookingSlots cmd)
        {
            GetAvailableBookingCommand command = new GetAvailableBookingCommand()
            {
                RoomIds = cmd.RoomIds,
                End = System.DateTime.Parse(cmd.EndDate),
                Start = System.DateTime.Parse(cmd.StartDate)
            };
            IEnumerable<SimpleBookingDto> res = await Mediator.Send(command);
            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IEnumerable<SimpleBookingDto>> GetConfirmedList(GetBookingSlots cmd)
        {
            GetConfirmedBookingsCommand command = new GetConfirmedBookingsCommand()
            {
                RoomIds = cmd.RoomIds,
                End = System.DateTime.Parse(cmd.EndDate),
                Start = System.DateTime.Parse(cmd.StartDate)
            };
            IEnumerable<SimpleBookingDto> res = await Mediator.Send(command);
            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<SimpleBookingDto> GetFirstSlot(GetBookingSlots cmd)
        {
            GetAvailableBookingByRoomCommand getAvailable = new GetAvailableBookingByRoomCommand()
            {
                RoomId = cmd.RoomId,
                End = System.DateTime.Parse(cmd.EndDate),
                Start = System.DateTime.Parse(cmd.StartDate)
            };
            SimpleBookingDto res = await Mediator.Send(getAvailable);
            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<APIResponse> Create(CreateSimpleBookingCommand cmd)
        {
            return await Mediator.Send(cmd);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IEnumerable<SimpleBookingDto>> GetAllViewBookRoom(GetAvailableBookingCommand cmd)
        {
            IEnumerable<SimpleBookingDto> res = await Mediator.Send(cmd);
            return res;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<Booking>> GetMyRawBooking(int bookingId = 0)
        {
            IEnumerable<Booking> res = await Mediator.Send(new GetMyBookingsCommand { BookingId = bookingId });
            return res;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<Booking>> GetRawBooking(int bookingId = 0)
        {
            IEnumerable<Booking> res = await Mediator.Send(new GetBookingsCommand { BookingId = bookingId });
            return res;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<Booking>> GetAllBookings(int bookingId = 0)
        {
            IEnumerable<Booking> res = await Mediator.Send(new GetAllBookingsCommand { BookingId = bookingId });
            return res;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<Booking>> GetClosedBooking(int bookingId = 0)
        {
            IEnumerable<Booking> res = await Mediator.Send(new GetClosedBookingsCommand { BookingId = bookingId });
            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<bool> CancelBooking(CancelCommand cmd)
        {
            bool res = await Mediator.Send(cmd);
            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<bool> CancelBookings(List<int> ids)
        {
            bool res = default;

            if (ids != null && ids.Count > 0)
            {
                foreach (int cancelId in ids)
                {
                    CancelCommand query = new() { BookingId = cancelId };
                    res = await Mediator.Send(query);
                }
            }

            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<APIResponse> UpdateSimpleBooking(UpdateSimpleBookingCommand cmd)
        {
            return await Mediator.Send(cmd);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<Unit> DeleteBooking(int bookingId)
        {
            DeleteBookingCommand query = new() { Id = bookingId };
            Unit res = await Mediator.Send(query);
            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<Unit> DeleteBookings(List<int> ids)
        {
            Unit res = default;

            if (ids != null && ids.Count > 0)
            {
                foreach (int roomId in ids)
                {
                    DeleteBookingCommand query = new() { Id = roomId };
                    res = await Mediator.Send(query);
                }
            }

            return res;
        }
    }
}