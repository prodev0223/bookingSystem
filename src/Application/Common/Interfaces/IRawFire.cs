using System.Collections.Generic;
using System.Threading.Tasks;
using booking.Application.Common.Models;
using booking.Domain.Entities;
using booking.Domain.Enums;

namespace booking.Application.Common.Interfaces
{
    public interface IRawFire
    {
        Task<string> AddFireToQueue(string message);
    }
}