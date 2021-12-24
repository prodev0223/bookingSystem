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

namespace booking.Application.Rooms.Queries
{
    [Permission((UserPermission.FacilityManagement))]
    [MediatrInject(MediatrServiceType.ApplicationDbContext)]
    public class GetRoomExtraFieldsQuery : IRequest<IEnumerable<RoomExtraInfoTemplate>>
    {
    }

    public partial class GetRoomExtraFieldsQueryHandler
    {
        public async Task<IEnumerable<RoomExtraInfoTemplate>> Handle(GetRoomExtraFieldsQuery request,
            CancellationToken ct)
        {
            var res = _applicationDbContext.RoomExtraInfoTemplates.Where(i => i.Id >= 0).AsNoTracking();
            return res;
        }
    }
}