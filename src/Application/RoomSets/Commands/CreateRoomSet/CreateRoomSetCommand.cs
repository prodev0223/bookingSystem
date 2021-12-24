using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using booking.Application.Rooms.Commands.CreateRooms;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.RoomSets.Commands.CreateRoomSet
{
    [MediatrInject(MediatrServiceType.ApplicationDbContext)]
    [Permission(UserPermission.FacilityManagement)]
    public class CreateRoomSetCommand : IRequest<int>
    {
        [Unique("RoomSets")]
        public string Name { get; set; }

        public bool AllRoom { get; set; }

        public IList<int> RoomIds { get; set; } = new List<int>();
    }

    public partial class CreateRoomSetCommandHandler
    {
        public async Task<int> Handle(CreateRoomSetCommand request, CancellationToken cancellationToken)
        {
            var roomSet = new RoomSet();
            roomSet.Name = request.Name;
            roomSet.AllRooms = request.AllRoom;
            foreach (var id in (request.RoomIds))
            {
                var room = await _applicationDbContext.Rooms.SingleAsync(i => i.Id == id, cancellationToken);
                if (room is not null)
                {
                    roomSet.Rooms .Add(room);
                }
            }
            var res = await _applicationDbContext.RoomSets.AddAsync(roomSet, cancellationToken);
            var updateCnt = await _applicationDbContext.SaveChangesAsync(cancellationToken);
            return res.Entity.Id;
        }
    }
}