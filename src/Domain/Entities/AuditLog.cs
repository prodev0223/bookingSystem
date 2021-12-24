using System;
using System.Collections.Generic;
using System.Text;

namespace booking.Domain.Entities
{
    public class AuditLog
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string TableName { get; set; }
        public string ActionType { get; set; }
        public DateTime EventTime { get; set; }
    }
}