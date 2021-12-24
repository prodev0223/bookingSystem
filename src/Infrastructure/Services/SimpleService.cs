using System;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using booking.Application.WeatherForecasts.Queries.GetWeatherForecasts;

namespace booking.Infrastructure.Services
{
    public class SimpleService : ISimpleService
    {
        public string Name { get; init; } = "Demo Name";
        public int Value { get; set; } = 1;

        public void AddOne()
        {
            ++Value;
        }

    }
}