using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using Hangfire;
using Microsoft.AspNetCore.Mvc.Formatters;

namespace booking.Infrastructure.Services
{
    public class RawHangFireTestService : IRawFire
    {
        public async Task<string> AddFireToQueue(string message)
        {
            var jobid = BackgroundJob.Enqueue(() => FireTest(message));
            return message;
        }

        public void FireTest(string msg)
        {
            int n = 10;

            string test = "";

            while (n-- > 0)
            {
                test += msg;
            }
        }
    }
}