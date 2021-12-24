using AutoMapper;
using booking.Application.Common.Mappings;
using booking.Domain.Common;
using booking.Domain.Entities;

namespace booking.Application.UserGroups.Queries
{
    public class UserGroupNameDto : AuditableEntity, IMapFrom<UserGroup>
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}