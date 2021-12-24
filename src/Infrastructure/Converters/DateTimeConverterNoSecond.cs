using System;
using booking.Domain;
using Newtonsoft.Json;
using JsonSerializer = Newtonsoft.Json.JsonSerializer;

namespace booking.Infrastructure.Converters
{
    /// <summary>
    /// Convert time to localtime of server and remove "seconds" from all api datetime object
    /// </summary>
    public class DateTimeConverterNoSecond : JsonConverter<DateTime>
    {
        public override void WriteJson(JsonWriter writer, DateTime value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override DateTime ReadJson(JsonReader reader, Type objectType, DateTime existingValue,
            bool hasExistingValue,
            JsonSerializer serializer)
        {
            return ((DateTime)reader.Value).RemoveSeconds().ToLocalTime();
        }

        public override bool CanWrite => false;
        public override bool CanRead => true;
    }
}