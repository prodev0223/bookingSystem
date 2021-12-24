using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Domain.Enums;
using FluentEmail.MailKitSmtp;
using MediatR;

namespace booking.Application.Email.Queries
{
    [Permission(UserPermission.AllPermission)]
    [MediatrInject(MediatrServiceType.EmailSendingService)]
    public class GetRawSmtpInfoQueries : IRequest<SmtpClientOptions>
    {
    }

    public partial class GetRawSmtpInfoQueriesHandler
    {
        public async Task<SmtpClientOptions> Handle(GetRawSmtpInfoQueries request, CancellationToken cancellationToken)
        {
            SmtpClientOptions res = await _emailSendingService.ReadSmtpSettings(cancellationToken);
            return res;
        }
    }
}