using booking.Domain.Enums;

namespace booking.Domain.Entities
{
    public class RoomExtraInfoTemplate
    {
        public int Id { get; set; }
        public string Key { get; set; }
        public FieldType Type { get; set; }
    }
}