using System;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using MediatR;

namespace booking.Application.Equipments.Command.DeleteEquipment
{
    public class DeleteEquipmentCommand : IRequest<int>
    {
        public string EquipmentCode { get; set; }
    }

    public class DeleteEquipmentCommandHandler : IRequestHandler<DeleteEquipmentCommand, int>
    {
        private readonly IApplicationDbContext _context;

        private readonly IHashIdService _hashIdService;

        public DeleteEquipmentCommandHandler(IApplicationDbContext context, IHashIdService hashIdService)
        {
            _context = context;

            _hashIdService = hashIdService;
        }

        public async Task<int> Handle(DeleteEquipmentCommand request, CancellationToken cancellationToken)
        {
            var eids = _hashIdService.Decode(request.EquipmentCode);

            if (eids.Length != 1)
            {
                throw new ArgumentException("Wrong equipment code");
            }

            var entity = await _context.Equipments.FindAsync(eids[0]);

            _context.Equipments.Remove(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return -1;
        }
    }
}