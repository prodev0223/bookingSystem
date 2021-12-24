using booking.Application.Common.Exceptions;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace booking.Application.AuditLog.Commands
{
    public class UpdateAuditlogcomand : IRequest<int>
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
    public class UpdateAuditlogcomandHandler : IRequestHandler<UpdateAuditlogcomand, int>
    {
        private readonly IApplicationDbContext _context;

        public UpdateAuditlogcomandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(UpdateAuditlogcomand request, CancellationToken cancellationToken)
        {
            Audits entity = _context.Auditlog.Find(request.Id);
            if (entity == null)
            {
                throw new NotFoundException();
            }

            entity.Rooms = request.Rooms;
            entity.RoomExtraFields = request.RoomExtraFields;
            entity.RoomGroups = request.RoomGroups;
            entity.PermissionGroups = request.PermissionGroups;
            entity.UserGroups = request.UserGroups;
            entity.SMTPServerSetting = request.SMTPServerSetting;
            await _context.SaveChangesAsync(cancellationToken);
            return entity.Id;

        }
    }
}
