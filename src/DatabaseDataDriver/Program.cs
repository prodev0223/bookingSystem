using System;
using System.Collections.ObjectModel;
using System.Reflection;
using booking.Application.Common.Interfaces;
using booking.Domain.Enums;
using MediatR;

namespace DatabaseDataDriver
{
    class Program
    {
        
               private static void ShowPossibleTimeZones(DateTimeOffset offsetTime)
               {
                  TimeSpan offset = offsetTime.Offset;
                  ReadOnlyCollection<TimeZoneInfo> timeZones;
            
                  Console.WriteLine("{0} could belong to the following time zones:",
                                    offsetTime.ToString());
                  // Get all time zones defined on local system
                  timeZones = TimeZoneInfo.GetSystemTimeZones();
                  // Iterate time zones
                  foreach (TimeZoneInfo timeZone in timeZones)
                  {
                     // Compare offset with offset for that date in that time zone
                     if (timeZone.GetUtcOffset(offsetTime.DateTime).Equals(offset))
                        Console.WriteLine("   {0}", timeZone.DisplayName);
                  }
                  Console.WriteLine();
               }
        static void Main(string[] args)
        {
                  DateTime thisDate = new DateTime(2007, 3, 10, 0, 0, 0);
                  DateTimeOffset thisTime;
                  //Console.WriteLine(pacific);
            
            
                  thisTime = new DateTimeOffset(thisDate, new TimeSpan(+8, 0, 0));
                  ShowPossibleTimeZones(thisTime);
            
              return;
        }
    }
}