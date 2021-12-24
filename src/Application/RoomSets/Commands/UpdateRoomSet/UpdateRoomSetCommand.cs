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
using FluentEmail.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.RoomSets.Commands.UpdateRoomSet
{
    [MediatrInject(MediatrServiceType.ApplicationDbContext)]
    [Permission(UserPermission.FacilityManagement)]
    public class UpdateRoomSetCommand : IRequest<int>
    {
        //[Unique("RoomSets")]
        public string Name { get; set; }
        public int Id { set; get; }
        public bool AllRoom { get; set; }
        public IList<int> RoomIds { get; set; } = new List<int>();
    }

    public partial class UpdateRoomSetCommandHandler
    {
        public async Task<int> Handle(UpdateRoomSetCommand request, CancellationToken cancellationToken)
        {
            var roomSet = await _applicationDbContext.RoomSets.Include(r => r.Rooms)
                .FirstAsync(r => r.Id == request.Id, cancellationToken);
            roomSet.Name = request.Name;
            roomSet.AllRooms = request.AllRoom;
            roomSet.Rooms.Clear();
            for (int i = 0; i < request.RoomIds.Count; i++)
            {
                var temp = _applicationDbContext.Rooms.Single(j => j.Id == request.RoomIds[i]); 
                roomSet.Rooms.Add(temp);
            }
                
            //roomSet.Rooms.(request.RoomIds.Select(i => new Room { Id = i }));
            var updateCnt = await _applicationDbContext.SaveChangesAsync(cancellationToken);
            //_applicationDbContext.AppUserRoles.Attach(new UserRole(){})
            return roomSet.Id;
        }
    }
}