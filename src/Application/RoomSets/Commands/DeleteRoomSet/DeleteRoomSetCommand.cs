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

namespace booking.Application.RoomSets.Commands.DeleteRoomSet
{
    [MediatrInject(MediatrServiceType.ApplicationDbContext)]
    [Permission(UserPermission.FacilityManagement)]
    public class DeleteRoomSetCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }

    public partial class DeleteRoomSetCommandHandler
    {
        public async Task<bool> Handle(DeleteRoomSetCommand request, CancellationToken cancellationToken)
        {
            if (request.Id <= 1)
            {
                return false;
            }

            var roomSet = _applicationDbContext.RoomSets.Remove(new RoomSet() { Id = request.Id });
            var updateCnt = await _applicationDbContext.SaveChangesAsync(cancellationToken);
            return updateCnt == 1;
        }
    }
}