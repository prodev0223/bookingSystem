using System;
using System.Collections.Generic;
using booking.Domain.Enums;

namespace booking.Domain.Entities
{
    public class RoomSettings
    {
        public int Id { get; set; }

        public IList<RoomTimeslot> BookingPeriods { get; set; } = new List<RoomTimeslot>();

        public BookingUserMode BookingUserMode { get; set; }

        public int AutoRelease { get; set; }

        public bool Disabled { get; set; }

        public BookingType DefaultBookingType { get; set; }

        public int InAdvanceDay { get; set; } = 14;
    }
}