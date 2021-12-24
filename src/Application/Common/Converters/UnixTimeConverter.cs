using System;

namespace booking.Application.Common.Converters
{
    public static class UnixTimeConverter
    {
        public static int ToUnix(DateTime v) => (int) v.Subtract(new DateTime(2000, 1, 1)).TotalSeconds;

        public static DateTime FromUnix(int v) => new DateTime(2000, 1, 1).AddSeconds(v);
    }
}