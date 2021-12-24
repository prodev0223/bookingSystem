using booking.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace booking.Domain.Entities
{
   public class Audits: AuditableEntity
    {
        public int Id { get; set; }
        public string Rooms { get; set; }
        public string RoomExtraFields { get; set; }
        public string RoomGroups { get; set; }
        public string PermissionGroups { get; set; }
        public string UserGroups { get; set; }
        public string SMTPServerSetting { get; set; }
        public string Booking { get; set; }
        public string EventDateTime { get; set; }
        public string LoginAccout { get; set; }
    }
}
