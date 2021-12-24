using System;
using booking.Domain.Enums;

namespace booking.Application.Bookings.Queries.GetAvailableBookings
{
    public class SimpleBookingDto
    {
        public bool Editable { get; set; } = true;

        public bool Viewable { get; set; }
        public DateTime Start { get; set; }

        public DateTime End { get; set; }

        public string InfoCode { get; set; }

        public int ResourceId { get; set; }

        public int RoomId { get; set; }

        public string Title { get; set; }

        public string Color { get; set; }

        public BookingStatus Status { get; set; }

        public BookingType BookingType { get; set; }

        public int BookingId { get; set; }

        public string Description { get; set; }

        public bool IsAvailable { get; set; }
    }
}