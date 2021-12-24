using booking.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace booking.Infrastructure.Persistence.Configurations
{
    public class RoomExtraInfoTemplateConfiguration : IEntityTypeConfiguration<RoomExtraInfoTemplate>
    {
        public void Configure(EntityTypeBuilder<RoomExtraInfoTemplate> builder)
        {
            builder.HasIndex(p => p.Key).IsUnique();
        }
    }
}