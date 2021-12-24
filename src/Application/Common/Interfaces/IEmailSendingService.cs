using System.Threading;
using System.Threading.Tasks;
using FluentEmail.MailKitSmtp;

namespace booking.Application.Common.Interfaces
{
    public interface IEmailSendingService
    {
        Task<string> SendSimpleEmail(string name, string body, string email);

        ISimpleService GetSimpleService();
        Task<bool> UpdateSmtpSettings(SmtpClientOptions smtpClientOptions, CancellationToken ct);

        Task<SmtpClientOptions> ReadSmtpSettings(CancellationToken ct);
    }
}