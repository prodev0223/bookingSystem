using System;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using MediatR;

namespace booking.Application.Equipments.Command.UpdateEquipment
{
    public class UpdateEquipmentCommand : IRequest<int>
    {
        public string EquipmentCode { get; set; }

        public string Name { get; set; }

        public string DepartmentCode { get; set; }
    }

    public class UpdateEquipmentCommandHandler : IRequestHandler<UpdateEquipmentCommand, int>
    {
        private readonly IApplicationDbContext _context;

        private readonly IHashIdService _hashIdService;

        public UpdateEquipmentCommandHandler(IApplicationDbContext context, IHashIdService hashIdService)
        {
            _context = context;

            _hashIdService = hashIdService;
        }

        public async Task<int> Handle(UpdateEquipmentCommand request, CancellationToken cancellationToken)
        {
            var eids = _hashIdService.Decode(request.EquipmentCode);

            if (eids.Length != 1)
            {
                throw new ArgumentException("Wrong equipment code");
            }


            var entity = await _context.Equipments.FindAsync(eids[0]);

            entity.Name = request.Name;

            if (request.DepartmentCode != null)
            {
                var dids = _hashIdService.Decode(request.DepartmentCode);
                if (dids.Length != 1)
                {
                    throw new ArgumentException("Wrong department code");
                }

                entity.DepartmentId = dids[0];
            }

            await _context.SaveChangesAsync(cancellationToken);

            return entity.ID;
        }
    }
}