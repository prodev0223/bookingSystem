using System;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.TodoLists.Queries.ExportTodos;
using booking.Application.WeatherForecasts.Queries.GetWeatherForecasts;
using booking.Infrastructure.Services;
using Hangfire;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace booking.WebUI.Controllers
{
    [Authorize]
    public class FireTestController : ApiControllerBase
    {
        //[HttpPost]
        //[Route("welcome")]
        //public IActionResult Welcome(string userName)
        //{
        //    var jobId = BackgroundJob.Enqueue(() => SendWelcomeMail(userName));
        //    return Ok($"Job Id {jobId} Completed. Welcome Mail Sent!");
        //}

        //public void SendWelcomeMail(string userName)
        //{
        //    //Logic to Mail the user
        //    Console.WriteLine($"Welcome to our application, {userName}");
        //}
        
        [HttpGet]
        [Route("welcome3")]
        public IActionResult Welcome3(string userName, int jobId)
        {
            // var x = new CreateLocationCommand {Name = userName};
            // BackgroundJob.Enqueue<Mediator>(fw => fw.Send(x, CancellationToken.None));
            // return Ok($"Hi{userName}Job Id {jobId} Completed. Welcome Mail Sent!");
            return Ok("Dummy OK");
        }
    }
}