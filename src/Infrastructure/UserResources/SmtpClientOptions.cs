using booking.Application.Common.Interfaces;
using FluentEmail.MailKitSmtp;

namespace booking.Infrastructure.UserResources
{
    public class CustomSmtpClientOptions : ISettings<CustomSmtpClientOptions>
    {
        public SmtpClientOptions SmtpClientOptions { get; set; }

        public CustomSmtpClientOptions WithDefaultValues()
        {
            return this;
        }
    }
}