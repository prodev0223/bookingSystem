using booking.Application.Common.Mappings;
using booking.Domain.Entities;

namespace booking.Application.UserPermissions.Queries
{
    public class PermissionSetDto : IMapFrom<PermissionSet>
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}