using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using booking.Application.UserPermissions.Commands.CreatePermissionSet;
using booking.Application.UserPermissions.Queries.GetPermissionNameList;
using booking.Application.UserRoles.Queries.GetMyRoles;
using booking.Application.WeatherForecasts.Queries.GetWeatherForecasts;
using booking.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

namespace booking.Application.IntegrationTests.Weather.Queries
{

    using static Testing;
    public class GetWeather : TestBase
    {
        [Test]
        public async Task ShouldGetWeather()
        {
            var uid = await RunAsAdministratorAsync();

            GetWeatherForecastsQuery query = new();

            var result = await SendAsync(query);

            result.Count().Should().Be(5);
        }
    }
}
