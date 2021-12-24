using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using booking.Application.Common.Interfaces;
using booking.Application.Rooms.Queries.GetRoomNameList;
using booking.Domain.Entities;
using FluentEmail.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.RoomSets.Queries.GetOneRoomSet
{
    public class GetOneRoomSetQuery : IRequest<RoomSetDto>
    {
        public int SetID { get; set; }
    }

    public class GetOneRoomSetQueryHandler : IRequestHandler<GetOneRoomSetQuery, RoomSetDto>
    {
        private readonly IApplicationDbContext _context;

        private readonly IMapper _mapper;

        private readonly IHashIdService _hashIdService;

        public GetOneRoomSetQueryHandler(IApplicationDbContext context, IMapper mapper, IHashIdService hashIdService)
        {
            _context       = context;
            _mapper        = mapper;
            _hashIdService = hashIdService;
        }

        public async Task<RoomSetDto> Handle(GetOneRoomSetQuery request,
                                             CancellationToken  cancellationToken)
        {
            RoomSet roomSet =
                await _context.RoomSets.Include(r => r.Rooms).Where(r => r.Id == request.SetID).FirstOrDefaultAsync();

            if (roomSet is null)
            {
                return null;
            }
            var rres = new RoomSetDto()
            {
                Id       = roomSet.Id,
                AllRoom = roomSet.AllRooms,
                Name     = roomSet.Name,
            };

            IEnumerable<int> res = roomSet.Rooms.Select(r => r.Id);

            rres.RoomIds.AddRange(res);

            return rres;
        }
    }
}