using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace booking.WebUI.Models.Booking
{
    public class GetBookingSlots
    {
        public int RoomId { get; set; }
        public string EndDate { get; set; }
        public string StartDate { get; set; }
        public IList<int>? RoomIds { get; set; }

        public GetBookingSlots(int roomId, string endDate, string startDate)
        {
            RoomId = roomId;
            EndDate = endDate;
            StartDate = startDate;
        }
    }
}