using booking.Application.Email.Queries;
using FluentEmail.MailKitSmtp;
using MediatR;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace booking.Application.Email.Command
{
    public class MailSender
    {
        public string Body { get; set; }
        public string Subject { get; set; }
        public string Receiver { get; set; }
        private SmtpClientOptions smtp { get; set; }

        public MailSender(SmtpClientOptions _smtpClientOptions)
        {
            smtp = _smtpClientOptions;
        }

        public bool SendTestMail(MailOptions mailOptions)
        {
            bool status = true;

            if (smtp != null)
            {
                try
                {
                    using (MailMessage mail = new())
                    {
                        mail.From = new MailAddress(smtp.User);
                        mail.To.Add(mailOptions.Receiver);
                        mail.Subject = mailOptions.Subject;
                        mail.Body = mailOptions.Body;
                        mail.IsBodyHtml = true;

                        if (mailOptions.Attachments != null)
                        {
                            foreach (string attachment in mailOptions.Attachments)
                            {
                                mail.Attachments.Add(new Attachment(attachment));
                            }
                        }

                        using (SmtpClient smtpClient = new(smtp.Server, smtp.Port))
                        {
                            smtpClient.Credentials = new NetworkCredential(smtp.User, smtp.Password);
                            smtpClient.EnableSsl = smtp.UseSsl;
                            smtpClient.Send(mail);
                        }
                    }
                }
                catch (Exception Ex)
                {
                    status = false;
                }
            }

            return status;
        }
    }

    public class MailOptions
    {
        public string Body { get; set; }
        public string Subject { get; set; }
        public string Receiver { get; set; }
        public List<string> Attachments { get; set; }
        public SmtpClientOptions Settings { get; set; }
    }
}