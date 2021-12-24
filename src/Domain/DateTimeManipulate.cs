using System;

namespace booking.Domain
{
    public static class DateTimeManipulate
    {
        public static DateTime RemoveSeconds(this DateTime dt)
        {
            return dt.Subtract(TimeSpan.FromSeconds(dt.Second)).Subtract(TimeSpan.FromMilliseconds(dt.Millisecond));
        }
    }
}