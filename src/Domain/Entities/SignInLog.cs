using System;
using System.Collections.Generic;
using System.Text;

namespace booking.Domain.Entities
{
    public class SignInLog
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string ActionType { get; set; }
        public DateTime EventTime { get; set; }
    }
}