using booking.Application.Common.Interfaces;
using System;

namespace booking.Infrastructure.Services
{
    public class DateTimeServiceService : IDateTimeService
    {
        public DateTime Now => DateTime.Now;
    }
}
