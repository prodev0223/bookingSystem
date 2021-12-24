using System;
using booking.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace booking.Infrastructure.Persistence.Configurations
{
    public class BookingConfiguration: IEntityTypeConfiguration<Booking>
    {
        
        public void Configure(EntityTypeBuilder<Booking> builder)
        {
        }
    }
}