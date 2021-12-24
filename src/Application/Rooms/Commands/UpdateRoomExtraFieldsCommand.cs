using System.Collections.Generic;
using booking.Application.Common.Exceptions;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Domain.Enums;
using Z.EntityFramework.Plus;

namespace booking.Application.Rooms.Commands
{
    [Permission((UserPermission.FacilityManagement))]
    [MediatrInject(MediatrServiceType.ApplicationDbContext)]
    public class UpdateRoomExtraFieldsCommand : IRequest<bool>
    {
        public IList<RoomExtraInfoTemplate> RoomExtraInfoTemplate = new List<RoomExtraInfoTemplate>();
    }

    public partial class UpdateRoomExtraFieldsCommandHandler
    {
        public async Task<bool> Handle(UpdateRoomExtraFieldsCommand request, CancellationToken ct)
        {
            var extraFields = _applicationDbContext.RoomExtraInfoTemplates.ToList();

            if (extraFields != null)
            {
                foreach (var item in extraFields)
                {
                    _applicationDbContext.RoomExtraInfoTemplates.Remove(item);
                }
            }

            if (request.RoomExtraInfoTemplate != null)
            {
                foreach (var item in request.RoomExtraInfoTemplate)
                {
                    _applicationDbContext.RoomExtraInfoTemplates.Add(item);
                }
            }
            
            await _applicationDbContext.SaveChangesAsync(ct);
            return true;
        }
    }
}