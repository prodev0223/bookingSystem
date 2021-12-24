using System.Collections.Generic;
using booking.Domain.Common;

namespace booking.Domain.Entities
{
    public class UserGroup: AuditableEntity
    {
        public int Id { get; set; }
        
        public string Name { get; set; }
        
        public IEnumerable<UserGroupApplicationUser> UserGroupApplicationUsers { get; set; }
        
        public IEnumerable<UserRole> UserRoles { get; set; }
    }
}