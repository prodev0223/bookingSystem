using System.Collections.Generic;
using booking.Application.Common.Mappings;
using booking.Application.Rooms.Queries.GetRoomNameList;
using booking.Domain.Entities;

namespace booking.Application.RoomSets.Queries.GetOneRoomSet
{
    public class RoomSetDto : IMapFrom<RoomSet>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool AllRoom { get; set; }

        public IList<int> RoomIds = new List<int>();
    }
}