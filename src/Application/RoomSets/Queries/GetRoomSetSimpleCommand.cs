using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper.QueryableExtensions;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.RoomSets.Queries
{
    [MediatrInject(
            MediatrServiceType.Logger,
            MediatrServiceType.Mapper,
            MediatrServiceType.ApplicationDbContext,
            MediatrServiceType.CurrentUserService
        )
    ]
    [Permission(UserPermission.FacilityManagement)]
    public class GetRoomSetSimpleCommand : IRequest<IEnumerable<RoomSetSimpleDto>>
    {
    }

    public partial class GetRoomSetSimpleCommandHandler
    {
        public async Task<IEnumerable<RoomSetSimpleDto>> Handle(GetRoomSetSimpleCommand request,
            CancellationToken ct)
        {
            var roomSetQuery =
                await
                    _applicationDbContext.RoomSets
                        .ProjectTo<RoomSetSimpleDto>(_mapper.ConfigurationProvider)
                        .AsNoTracking().ToListAsync(ct);
#if DEBUG
            //_logger.Log(LogLevel.Debug, "SQL" + roomSetQuery.ToQueryString());
#endif
            return roomSetQuery;
        }
    }
}