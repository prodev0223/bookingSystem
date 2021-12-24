using System;
using System.Collections.Generic;
using booking.Domain.Common;
using booking.Domain.Enums;

namespace booking.Domain.Entities
{
    public class Booking : AuditableEntity
    {
        public int Id { get; set; }

        public BookingStatus BookingStatus { get; set; }

        public BookingDetails BookingDetails { get; set; }

        public int BookingDetailsId { get; set; }

        public DateTime Start { get; set; }

        public DateTime End { get; set; }

        public BookingType BookingType { get; set; }

        public Room Room { get; set; }

        public int? RoomId { get; set; }

        public override string ToString()
        {
            return $"{Id}";
        }

        public List<BookingApplicationUser> BookingApplicationUser { get; set; } = new List<BookingApplicationUser>();
    }
}