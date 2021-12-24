using booking.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace booking.Infrastructure.Persistence.Configurations
{
    public class UserGroupApplicationUserConfiguration : IEntityTypeConfiguration<UserGroupApplicationUser>
    {
        public void Configure(EntityTypeBuilder<UserGroupApplicationUser> builder)
        {
            builder.HasKey(x => new {
                  x.UserGroupId, x.ApplicationUserId
            });
        }
    }
}