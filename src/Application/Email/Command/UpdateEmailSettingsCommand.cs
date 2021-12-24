using MediatR;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Application.Email.Command.SendTestMail;
using booking.Domain.Enums;
using FluentEmail.Core;
using FluentEmail.Core.Models;
using FluentEmail.MailKitSmtp;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace booking.Application.Email.Command
{
    [Permission(UserPermission.AllPermission)]
    [MediatrInject(MediatrServiceType.EmailSendingService)]
    public class UpdateEmailSettingsCommand : IRequest<bool>
    {
        public SmtpClientOptions Settings { get; set; }
    }

    public partial class UpdateEmailSettingsCommandHandler
    {
        public async Task<bool> Handle(UpdateEmailSettingsCommand request, CancellationToken cancellationToken)
        {
            if (request.Settings is null)
            {
                throw new Exception("SmtpClientOptions cannot be null");
            }
            
            var res = await _emailSendingService.UpdateSmtpSettings(request.Settings, cancellationToken);
            return res;
        }
    }
}