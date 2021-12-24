using System;
using System.Collections.Generic;
using System.IO;
using booking.Application.Common.Interfaces;
using booking.Domain.Common;
using booking.Domain.Entities;
using booking.Infrastructure.Identity;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using booking.Domain;
using booking.Domain.Enums;
using booking.Infrastructure.Comparers;
using booking.Infrastructure.Converter;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using UserGroup = booking.Domain.Entities.UserGroup;

namespace booking.Infrastructure.Persistence
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>, IApplicationDbContext
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IDateTimeService _dateTimeService;
        private readonly IDomainEventService _domainEventService;

        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions,
            ICurrentUserService currentUserService,
            IDomainEventService domainEventService,
            IDateTimeService dateTimeService) : base(options, operationalStoreOptions)
        {
            _currentUserService = currentUserService;
            _domainEventService = domainEventService;
            _dateTimeService = dateTimeService;
        }

        public DbSet<Booking> Bookings { get; set; }

        public DbSet<TodoItem> TodoItems { get; set; }

        public DbSet<TodoList> TodoLists { get; set; }

        public DbSet<EmailQueue> EmailQueues { get; set; }

        public DbSet<EmailTemplate> EmailTemplates { get; set; }

        public DbSet<Equipment> Equipments { get; set; }

        public DbSet<Room> Rooms { get; set; }

        public DbSet<SMTPSettings> SMTPSettings { get; set; }

        public DbSet<Contact> Contacts { get; set; }

        public DbSet<RoomSet> RoomSets { get; set; }

        public DbSet<PermissionSet> PermissionSet { get; set; }
        public DbSet<UserRole> AppUserRoles { get; set; }

        public DbSet<EquipmentLoan> EquipmentLoans { get; set; }

        public DbSet<UserGroup> UserGroups { get; set; }

        public DbSet<BookingApplicationUser> BookingApplicationUsers { get; set; }

        public DbSet<UserGroupApplicationUser> UserGroupApplicationUsers { get; set; }

        public DbSet<PluginSetting> PluginSettings { get; set; }

        public DbSet<RoomExtraInfoTemplate> RoomExtraInfoTemplates { get; set; }
        public DbSet<Audits> Auditlog { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<SignInLog> SignInLogs { get; set; }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            List<EntityEntry<AuditableEntity>> entityEntries = new List<EntityEntry<AuditableEntity>>();

            foreach (EntityEntry<AuditableEntity> entry in ChangeTracker.Entries<AuditableEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entityEntries.Add(entry);
                        entry.Entity.Created = _dateTimeService.Now;
                        entry.Entity.CreatedBy = _currentUserService.UserId;
                        break;

                    case EntityState.Modified:
                        entityEntries.Add(entry);
                        entry.Entity.LastModified = _dateTimeService.Now;
                        entry.Entity.LastModifiedBy = _currentUserService.UserId;
                        break;

                    case EntityState.Deleted:
                        entityEntries.Add(entry);
                        break;
                }
            }

            entityEntries.ForEach(item => WriteAuditLog(ChangeTracker.Context, item));
            var result = await base.SaveChangesAsync(cancellationToken);

            await DispatchEvents();

            return result;
        }

        private void WriteAuditLog(DbContext dbContext, EntityEntry<AuditableEntity> entry)
        {
            if (entry.Entity.GetType().Name == "AuditLog")
            {
                return;
            }
            else
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                    case EntityState.Deleted:
                    case EntityState.Modified:
                        AuditLog auditLog = new AuditLog()
                        {
                            EventTime = DateTime.UtcNow,
                            ActionType = entry.State.ToString(),
                            UserId = _currentUserService.UserId,
                            TableName = entry.Entity.GetType().Name,
                        };
                        dbContext.Add(auditLog);
                        break;
                }
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(builder);
        }

        private async Task DispatchEvents()
        {
            while (true)
            {
                var domainEventEntity = ChangeTracker.Entries<IHasDomainEvent>()
                    .Select(x => x.Entity.DomainEvents)
                    .SelectMany(x => x)
                    .Where(domainEvent => !domainEvent.IsPublished)
                    .FirstOrDefault();
                if (domainEventEntity == null) break;

                domainEventEntity.IsPublished = true;
                await _domainEventService.Publish(domainEventEntity);
            }
        }
    }
}