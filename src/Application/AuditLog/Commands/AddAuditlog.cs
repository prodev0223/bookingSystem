using System.Collections.Generic;
using System.Linq;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using booking.Domain.Events;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Security;
using booking.Domain.Enums;
using booking.Application.AuditLog.Queries.Audit;

namespace booking.Application.AuditLog.Commands
{
    public class AddAuditlog : IRequest<int>
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
    }
    public class AddAuditlogCommandHandler : IRequestHandler<AddAuditlog, int>
    {
        private readonly IApplicationDbContext _context;

        public AddAuditlogCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(AddAuditlog request, CancellationToken cancellationToken)
        {
            var entity = new Audits
            {
                Rooms = request.Rooms,
                RoomExtraFields = request.RoomExtraFields,
                RoomGroups = request.RoomGroups,
                PermissionGroups = request.PermissionGroups,
                UserGroups = request.UserGroups,
                SMTPServerSetting = request.SMTPServerSetting,
            };
            _context.Auditlog.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);
            return entity.Id;

        }
    }
}


