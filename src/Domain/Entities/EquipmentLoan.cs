using System;
using System.Collections.Generic;

namespace booking.Domain.Entities
{
    public class EquipmentLoan
    {
        public int Id { get; set; }

        public Booking Booking { get; set; }

        public DateTime LoanDate { get; set; }

        public DateTime? ReturnDate { get; set; }

        public IList<Equipment> EquipmentList { get; set; } = new List<Equipment>();

        public IList<Contact> UserContacts { get; set; } = new List<Contact>();

        public IList<Contact> StaffContacts { get; set; } = new List<Contact>();
    }
}