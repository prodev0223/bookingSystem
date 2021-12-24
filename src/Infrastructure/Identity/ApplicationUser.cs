using System.Collections.Generic;
using booking.Domain.Entities;
using booking.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using UserGroup = booking.Domain.Entities.UserGroup;

namespace booking.Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string ExternalId { get; set; } = "";

        public IList<BookingApplicationUser> BookingApplicationUser { get; set; } = new List<BookingApplicationUser>();

        public IList<UserGroupApplicationUser> UserGroupApplicationUser { get; set; } = new List<UserGroupApplicationUser>();
    }
}