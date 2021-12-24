using System.Collections.Generic;
using booking.Domain.Common;
using booking.Domain.Enums;

namespace booking.Domain.Entities
{
    public class PermissionSet : AuditableEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public ICollection<UserPermission> Permissions { get; set; } = new List<UserPermission>();
    }
}