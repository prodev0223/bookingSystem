using booking.Application.Common.Interfaces;
using FluentEmail.MailKitSmtp;

namespace booking.Application.Common
{
    public class CoreSettings : ISettings<CoreSettings>
    {
        public SmtpClientOptions SmtpClientOptions { get; set; }

        public CoreSettings WithDefaultValues()
        {
            return this;
        }
    }
}