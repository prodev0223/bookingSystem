using System.Collections;
using System.Collections.Generic;

namespace booking.Application.Common.Interfaces
{
    public interface IHashIdService
    {
        public string Encode(params int[] ids);

        public int[] Decode(string coded);
        
        public string EncodeLong(params long[] ids);

        public long[] DecodeLong(string coded);

        public void SetHash(string key);
    }
}