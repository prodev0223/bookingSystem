using System.Collections;
using System.Collections.Generic;
using booking.Application.Common.Interfaces;
using HashidsNet;

namespace booking.Infrastructure.Services
{
    public class HashIdService : IHashIdService
    {
        private Hashids _hashId = new("TSA", 12);

        public void SetHash(string key)
        {
            _hashId = new Hashids(key);
        }

        public string Encode(params int[] ids)
        {
            var res = _hashId.Encode(ids);

            return res;
        }

        public int[] Decode(string coded)
        {
            var res = _hashId.Decode(coded);

            return res;
        }

        public string EncodeLong(params long[] ids)
        {
            var res = _hashId.EncodeLong(ids);

            return res;
        }

        public long[] DecodeLong(string coded)
        {
            var res = _hashId.DecodeLong(coded);

            return res;
        }
    }
}