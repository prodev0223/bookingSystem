using MediatR;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Domain.Enums;
using FluentEmail.Core;
using FluentEmail.Core.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace booking.Application.Email.Command.SendTestMail
{
    [Permission(UserPermission.AllPermission)]
    public class SendTestMailCommand : IRequest<SendResponse>
    {
        public string Subject { get; set; }

        public string Body { get; set; }
    }

    public class SendTestMailCommandHandler : IRequestHandler<SendTestMailCommand, SendResponse>
    {
        private readonly IFluentEmail _fluentEmail = null;

        public SendTestMailCommandHandler(IFluentEmail fluentEmail)
        {
            _fluentEmail = fluentEmail;
        }

        public Task<SendResponse> Handle(SendTestMailCommand request, CancellationToken cancellationToken)
        {
            Task<SendResponse> res = _fluentEmail
                .SetFrom("hugo@ast-hk.com")
                .To("hugotai101@gmail.com")
                .Subject(request.Subject)
                .Body(request.Body)
                .SendAsync();
            return res;
        }
    }
}