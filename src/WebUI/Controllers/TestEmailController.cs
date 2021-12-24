using System;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using booking.Application.Email.Command;
using booking.Application.Email.Command.SendTestMail;
using booking.Application.Email.Queries;
using booking.Application.SimpleServiceTest.Commands;
using booking.Application.SimpleServiceTest.Queries;
using booking.Infrastructure.ServiceHelper;
using booking.Infrastructure.Services;
using FluentEmail.Core.Models;
using FluentEmail.MailKitSmtp;
using Hangfire;
using Hangfire.Common;
using Hangfire.Storage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace booking.WebUI.Controllers
{
    [Authorize]
    public class TestEmailController : ApiControllerBase
    {
        [HttpGet]
        [Route("testing")]
        public async Task<ActionResult<SendResponse>> Welcome3(SendTestMailCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost]
        [Route("fireSchedule")]
        public IActionResult Welcome2(SendTestMailCommand cmd)
        {
            //var jid = BackgroundJob.Schedule<Mediator>(fw => fw.Send(cmd, CancellationToken.None),
            //    new DateTimeOffset(new DateTime(2021, 3, 29, 2, 45, 0)));
            var uid = BackgroundJob.Enqueue<EmailSendingService>(fw =>
                fw.SendSimpleEmail(cmd.Subject, cmd.Body, "hugo@ast-hk.com"));
            return Ok($"{uid}");
        }

        [HttpGet]
        [Route("firefire")]
        public IActionResult Welcome1(SendTestMailCommand cmd)
        {
            RecurringJob.AddOrUpdate<Mediator>(fw => fw.Send(cmd, CancellationToken.None), Cron.Hourly);

            return Ok("check fire");
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<SimpleServiceDto> GetSimpleServiceDto()
        {
            GetSimpleServiceInfoQuery query = new();
            var res = await Mediator.Send(query);
            return res;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<string> UpdateSimpleServiceDto(string name)
        {
            ReplaceSimpleServiceCommand query = new() { Name = name };
            var res = await Mediator.Send(query);
            return res;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<bool> SimpleAddOne()
        {
            SimpleAddOneCommand query = new() { };
            var res = await Mediator.Send(query);
            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<bool> UpdateEmailSettings(UpdateEmailSettingsCommand cmd)
        {
            var res = await Mediator.Send(cmd);
            return res;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<SmtpClientOptions> GetRawSmtpInfo()
        {
            var res = await Mediator.Send(new GetRawSmtpInfoQueries());
            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<string> GetFireStatus(string jobId)
        {
            IStorageConnection connection = JobStorage.Current.GetConnection();
            JobData jobData = connection.GetJobData(jobId);
            string stateName = jobData.State;
            return stateName;
        }

        [HttpPost]
        [Route("sendtestmail")]
        public Task<bool> SendTestMailAsync(MailOptions command)
        {
            bool status = false;

            if (command.Settings != null)
            {
                MailSender mailSender = new MailSender(command.Settings);

                if (mailSender != null)
                {
                    status = mailSender.SendTestMail(command);
                }
            }

            return Task.FromResult(status);
        }
    }
}