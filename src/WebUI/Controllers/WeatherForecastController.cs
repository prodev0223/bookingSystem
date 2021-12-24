using System;
using booking.Application.WeatherForecasts.Queries.GetWeatherForecasts;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace booking.WebUI.Controllers
{
    [Authorize]
    public class WeatherForecastController : ApiControllerBase
    {
        [HttpPost]
        public async Task<IEnumerable<WeatherForecast>> Get(GetWeatherForecastsQuery cmd)
        {
            return await Mediator.Send(cmd);
        }
    }
}
