using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Newtonsoft.Json;

namespace booking.Infrastructure.Converter
{
        
    public class IntCollectionConverter: ValueConverter<IList<int>, string> 
    {
        public IntCollectionConverter() : base(
            v => JsonConvert
                .SerializeObject(v.Select(e => e.ToString()).ToList()),
            v => JsonConvert
                .DeserializeObject<IList<string>>(v)
                .Select(e =>  int.Parse(e)).ToList())
        {
        }
    }
}
