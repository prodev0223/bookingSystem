using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace booking.Application.AuditLog.Queries.Audit
{
   public class AuditlogModel
    {
        public string Id { get; set; }
        public string Rooms { get; set; }
        public string RoomExtraFields { get; set; }
        public string RoomGroups { get; set; }
        public string PermissionGroups { get; set; }
        public string UserGroups { get; set; }
        public string SMTPServerSetting { get; set; }
        public string Booking { get; set; }
        public string EventDateTime { get; set; }
        public string LoginAccout { get; set; }
        public string CreatedBy { get; set; }
        public string LastModified { get; set; }
        public string LastModifiedBy { get; set; }
    }
}
