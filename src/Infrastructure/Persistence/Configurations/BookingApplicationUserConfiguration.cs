using System;
using System.Collections.Generic;
using booking.Domain.Entities;
using booking.Infrastructure.Converter;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace booking.Infrastructure.Persistence.Configurations
{
    public class BookingApplicationUserConfiguration : IEntityTypeConfiguration<BookingApplicationUser>
    {
        public void Configure(EntityTypeBuilder<BookingApplicationUser> builder)
        {
            builder.HasKey(x => new {
                  x.BookingId, x.ApplicationUserId
            });
        }
    }
}