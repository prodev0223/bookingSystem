using System;
using booking.Domain.Common;

namespace booking.Domain.Entities
{
    public class SMTPSettings : AuditableEntity
    {
        public int Id { get; set; }

        public string ServerUrl { get; set; } = "";

        public int ServerPort { get; set; }

        public string Login { get; set; } = "";

        public string Password { get; set; } = "";

        public bool EnableSSL { get; set; }

        public string SenderEmail { get; set; } = "";

        public bool Enabled { get; set; }

        public EmailTemplate EmailTemplate { get; set; }
    }
}