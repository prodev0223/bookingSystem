using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using booking.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Equipments.Query.GetEquipmentNameList
{
    public class GetEquipmentNamesQuery : IRequest<IEnumerable<EquipmentNameDtos>>
    {
    }

    public class GetEquipmentsQueryHandler : IRequestHandler<GetEquipmentNamesQuery, IEnumerable<EquipmentNameDtos>>
    {
        private readonly IApplicationDbContext _context;

        private readonly IHashIdService _hashIdService;

        public GetEquipmentsQueryHandler(IApplicationDbContext context, IMapper mapper,
                                         IHashIdService        hashIdService
            )
        {
            _context = context;

            _hashIdService = hashIdService;
        }

        public async Task<IEnumerable<EquipmentNameDtos>> Handle(GetEquipmentNamesQuery request,
                                                                 CancellationToken      cancellationToken)
        {
            var rawDB = await _context.Equipments
                                      .AsNoTracking()
                                      .ToListAsync(cancellationToken);
            var res = rawDB.Select(r => new EquipmentNameDtos
            {
                Name           = r.Name,
                DepartmentCode = r.DepartmentId != null ? _hashIdService.Encode((int) r.DepartmentId) : "",
                EquipmentCode  = _hashIdService.Encode(r.ID),
            });
            return res;
        }
    }
}