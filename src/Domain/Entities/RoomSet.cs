using System.Collections.Generic;
using booking.Domain.Common;

namespace booking.Domain.Entities
{
    public class RoomSet : AuditableEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool AllRooms { get; set; }

        public bool SoftwareSystem { get; set; }

        public IList<Room> Rooms { get; set; } = new List<Room>();
    }
}