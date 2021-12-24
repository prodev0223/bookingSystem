using System;

namespace booking.Domain.Entities
{
    public class BookingRuleSettings
    {
        public int Id { get; set; }
        public int WeeklyCount { get; set; } = int.MaxValue;
        public int DailyCount { get; set; } = int.MaxValue;
        public TimeSpan WeeklyHour { get; set; } = TimeSpan.MaxValue;
        public TimeSpan DailyHour { get; set; } = TimeSpan.MaxValue;
        public TimeSpan FixedBlock { get; set; } = TimeSpan.MaxValue;
        public DayOfWeek DayOfWeek { get; set; }
        public DateTime ApplyFrom { get; set; } = DateTime.MinValue;
        public DateTime ApplyTo { get; set; } = DateTime.MaxValue;
    }
}