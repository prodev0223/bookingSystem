using booking.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using booking.Domain;

namespace booking.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        public DbSet<Booking> Bookings { get; set; }

        public DbSet<TodoItem> TodoItems { get; set; }

        public DbSet<TodoList> TodoLists { get; set; }

        public DbSet<EmailQueue> EmailQueues { get; set; }

        public DbSet<EmailTemplate> EmailTemplates { get; set; }

        public DbSet<Equipment> Equipments { get; set; }

        public DbSet<Room> Rooms { get; set; }

        public DbSet<SMTPSettings> SMTPSettings { get; set; }

        public DbSet<Contact> Contacts { get; set; }

        public DbSet<UserRole> AppUserRoles { get; set; }

        public DbSet<RoomSet> RoomSets { get; set; }

        public DbSet<PermissionSet> PermissionSet { get; set; }

        public DbSet<EquipmentLoan> EquipmentLoans { get; set; }

        public DbSet<UserGroup> UserGroups { get; set; }

        public DbSet<BookingApplicationUser> BookingApplicationUsers { get; set; }

        public DbSet<UserGroupApplicationUser> UserGroupApplicationUsers { get; set; }

        public DbSet<PluginSetting> PluginSettings { get; set; }

        public DbSet<RoomExtraInfoTemplate> RoomExtraInfoTemplates { get; set; }

        public DbSet<Audits> Auditlog { get; set; }

        public DbSet<Domain.Entities.AuditLog> AuditLogs { get; set; }

        public DbSet<SignInLog> SignInLogs { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}