using System.Collections.Generic;
using booking.Domain.Common;

namespace booking.Domain.Entities
{
    public class Equipment : AuditableEntity
    {
        public int ID { get; set; }

        public string Name { get; set; } = "";

        public int? DepartmentId { get; set; }

        public int Count { get; set; }

        public int MaxCount { get; set; }

        public IList<BookingDetails> BookingDetailsList { get; set; } = new List<BookingDetails>();

        public IList<EquipmentLoan> EquipmentLoans { get; set; } = new List<EquipmentLoan>();
    }
}