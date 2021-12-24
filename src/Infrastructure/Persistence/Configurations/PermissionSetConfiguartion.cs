using booking.Domain.Entities;
using booking.Domain.Enums;
using booking.Infrastructure.Comparers;
using booking.Infrastructure.Converter;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace booking.Infrastructure.Persistence.Configurations
{
    public class PermissionSetConfiguartion : IEntityTypeConfiguration<PermissionSet>
    {
        public void Configure(EntityTypeBuilder<PermissionSet> builder)
        {
            var converter = new EnumCollectionJsonValueConverter<UserPermission>();
            var comparer  = new CollectionValueComparer<UserPermission>();

            builder.Property(p => p.Permissions)
                   .HasConversion(converter)
                   .Metadata.SetValueComparer(comparer);
        }
    }
}