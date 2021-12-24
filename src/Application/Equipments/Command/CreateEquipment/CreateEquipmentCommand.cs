using System;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using MediatR;

namespace booking.Application.Equipments.Command.CreateEquipment
{
    public class CreateEquipmentCommand : IRequest<int>
    {
        public string Name { get; set; }

        public string DepartmentCode { get; set; }
    }

    public class CreateEquipmentCommandHandler : IRequestHandler<CreateEquipmentCommand, int>
    {
        private readonly IApplicationDbContext _context;

        private readonly IHashIdService _hashIdService;

        public CreateEquipmentCommandHandler(IApplicationDbContext context, IHashIdService hashIdService)
        {
            _context = context;

            _hashIdService = hashIdService;
        }

        public async Task<int> Handle(CreateEquipmentCommand request, CancellationToken cancellationToken)
        {
            var ids = _hashIdService.Decode(request.DepartmentCode);
            if (ids.Length != 1)
            {
                throw new ArgumentException("Wrong department code");
            }

            var entity = new Equipment
            {
                Name = request.Name,

                DepartmentId = ids[0],
            };

            _context.Equipments.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.ID;
        }
    }
}