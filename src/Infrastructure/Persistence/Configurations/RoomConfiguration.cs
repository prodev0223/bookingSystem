using System;
using System.Collections.Generic;
using System.Linq;
using booking.Domain.Entities;
using booking.Infrastructure.Converter;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace booking.Infrastructure.Persistence.Configurations
{
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            var converter = new IntCollectionConverter();

            builder.Property(p => p.CombinableRooms)
                   .HasConversion(converter);
        }
    }
}