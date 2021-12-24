using System;
using System.Collections.Generic;
using booking.Domain.Entities;
using booking.Infrastructure.Converter;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace booking.Infrastructure.Persistence.Configurations
{
    public class BookingDetailsConfiguration : IEntityTypeConfiguration<BookingDetails>
    {
        public void Configure(EntityTypeBuilder<BookingDetails> builder)
        {
            var converter = new JsonValueConverter<IList<string>>();

            builder.Property(p => p.Users)
                   .HasConversion(converter);
        }
    }
}