using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common;
using booking.Application.Common.Interfaces;
using booking.Application.WeatherForecasts.Queries.GetWeatherForecasts;
using booking.Domain.Entities;
using booking.Domain.SettingsEntities;
using booking.Infrastructure.Services;
using booking.Infrastructure.UserResources;
using FluentEmail.Core;
using FluentEmail.Core.Models;
using FluentEmail.MailKitSmtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;

namespace booking.Infrastructure.ServiceHelper
{
    public class EmailSendingService : IEmailSendingService
    {
        //private readonly IServiceCollection _serviceCollection;
        //private IServiceProvider _serviceProvider;
        //private IConfiguration _config;
        private SmtpClientOptions _smtpClientOptions1;
        private readonly ISettingsService _settingsService;

        public EmailSendingService(IConfiguration config, ISettingsService settingsService)
        {
            _settingsService = settingsService;
            //_config = config;
            //_smtpClientOptions1 = _config.GetSection("DefaultOffice365Settings").Get<SmtpClientOptions>();
            //var serviceCollection =
            //    new ServiceCollection()
            //        .AddSingleton<ISimpleService, SimpleService>();
            //_serviceCollection = serviceCollection;
            //_serviceProvider = _serviceCollection.BuildServiceProvider();
        }

        public async Task<string> SendSimpleEmail(string title, string body, string emailAddress)
        {
            //_serviceCollection.RemoveAll<ISimpleService>();
            //_serviceCollection.AddSingleton<ISimpleService>(x => new SimpleService { Name = title });
            //_serviceProvider = _serviceCollection.BuildServiceProvider();
                
            var smtpHolder = await _settingsService.Get<CustomSmtpClientOptions>("SmtpClientOptionsV1", CancellationToken.None);
            var smtpClientOptions = smtpHolder.SmtpClientOptions;

            if(smtpClientOptions != null)
            {
                Email.DefaultSender = new MailKitSender(smtpClientOptions);
                var email = Email
                    .From(smtpClientOptions.User)
                    .To(emailAddress)
                    .Subject(title)
                    .Body(body);
                email.Send();
            }           

            return "";
        }

        public async Task<bool> UpdateSmtpSettings(SmtpClientOptions smtpClientOptions, CancellationToken ct)
        {
            try
            {
                var a = new CustomSmtpClientOptions();
                a.SmtpClientOptions = smtpClientOptions;
                await _settingsService.Set<CustomSmtpClientOptions>("SmtpClientOptionsV1", a, ct);
                _smtpClientOptions1 = smtpClientOptions;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
            return true;
        }
        
        public async Task<SmtpClientOptions> ReadSmtpSettings(CancellationToken ct)
        {
            var res = await _settingsService.Get<CustomSmtpClientOptions>("SmtpClientOptionsV1", ct);
            return res.SmtpClientOptions;
        }

        public ISimpleService GetSimpleService()
        {
            // THIS IS USELESS ABC
            return new SimpleService();
        }
    }
}