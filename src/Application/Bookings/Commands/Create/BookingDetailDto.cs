using System.Collections.Generic;
using booking.Domain.Entities;

namespace booking.Application.Bookings.Commands.Create
{
    public class BookingDetailDto
    {
        public string Description { get; set; } = "";
        public IList<string> EquipmentsID { get; set; } = new List<string>();
        public IList<CustomField> CustomFields { get; set; }
    }

    public class CustomField
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}