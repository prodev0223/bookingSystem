using System.Collections.Generic;
using booking.Domain.Common;
using booking.Domain.Enums;

namespace booking.Domain.Entities
{
    public class UserRole : AuditableEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public RoomSet RoomSet { get; set; }
        
        public int RoomSetId { get; set; }

        public PermissionSet PermissionSet { get; set; }
        
        public int PermissionSetId { get; set; }
        
        public IEnumerable<UserGroup> UserGroups { get; set; }
    }
}