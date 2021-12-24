using System.Collections.Generic;

namespace booking.Domain.Entities
{
    public class BookingDetails
    {
        public int Id { get; set; }

        public IList<string> Users { get; set; }

        public string Description { get; set; } = "";

        public IList<Equipment> Equipments { get; set; } = new List<Equipment>();
    }
}