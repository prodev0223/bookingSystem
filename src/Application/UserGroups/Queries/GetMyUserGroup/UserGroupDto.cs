using System.Collections.Generic;
using booking.Domain.Common;

namespace booking.Application.UserGroups.Queries.GetMyUserGroup
{
    public class UserGroupDto : AuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<string> UserIds { get; set; }
        public IEnumerable<int> UserRoleIds { get; set; }
    }

    public class LoggedUserInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<int> UserRoleIds { get; set; }
        public IEnumerable<string> UserRoleNames { get; set; }
    }
}