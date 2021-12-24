using System.Collections.Generic;
using booking.Domain.Common;

namespace booking.Domain.Entities
{
    public class Room : AuditableEntity
    {
        public int Id { get; set; }

        public string Name { get; set; } = "";

        public string ShortName { get; set; } = "";

        public string ChineseName { get; set; } = "";

        public string MappingKey { get; set; } = "";

        public RoomSettings RoomSettings { get; set; }

        public int RoomSettingsId { get; set; }

        public IList<int> CombinableRooms { get; set; } = new List<int>();

        public IList<RoomSet> RoomSets { get; set; } = new List<RoomSet>();

        public IList<RoomExtraInfoField> RoomExtraInfoFields { get; set; } = new List<RoomExtraInfoField>();
    }
}