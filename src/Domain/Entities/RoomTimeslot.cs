using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace booking.Domain.Entities
{
    public class RoomTimeslot
    {
        public int Id { get; set; }

        public DayOfWeek DayOfWeek { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public TimeSpan Interval { get ; set; }
    }
}