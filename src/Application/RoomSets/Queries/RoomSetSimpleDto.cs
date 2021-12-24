using booking.Application.Common.Mappings;
using booking.Domain.Entities;

namespace booking.Application.RoomSets.Queries
{
    public class RoomSetSimpleDto : IMapFrom<RoomSet>
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}