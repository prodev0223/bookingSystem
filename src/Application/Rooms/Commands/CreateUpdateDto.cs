using System;
using System.Collections.Generic;
using booking.Domain.Entities;
using booking.Domain.Enums;

namespace booking.Application.Rooms.Commands
{
    public class CreateUpdateRoomDto
    {
        public int RoomId { get; set; }

        public string Name { get; set; }

        public string ShortName { get; set; }

        public string ChineseName { get; set; }

        public string MappingKey { get; set; }

        public DateTime Start { get; set; }

        public DateTime End { get; set; }

        public int TimeSpanMinutes { get; set; }

        public int BookingUserModeId { get; set; }

        public int AutoRelease { get; set; }

        public bool Disabled { get; set; }

        public int DefaultBookingTypeId { get; set; }

        public int InAdvanceDay { get; set; }

        public IEnumerable<RoomExtraInfoField> RoomExtraInfoFields { get; set; } = new List<RoomExtraInfoField>();
    }
}