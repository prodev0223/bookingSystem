using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using booking.Domain.Events;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Exceptions;
using booking.Application.Common.Security;
using booking.Domain.Enums;

namespace booking.Application.UserRoles.Commands.UpdateUserRole
{
    public class UpdateUserRoleCommand : IRequest<int>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int PermissionSetId { get; set; }

        public int RoomSetId { get; set; }
    }

    public class UpdateDepartmentCommandHandler : IRequestHandler<UpdateUserRoleCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDepartmentCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(UpdateUserRoleCommand request, CancellationToken cancellationToken)
        {
            UserRole entity = _context.AppUserRoles.Find(request.Id);

            if (entity == null)
            {
                throw new NotFoundException();
            }
            
            entity.PermissionSetId = request.PermissionSetId;
            entity.RoomSetId = request.RoomSetId;
            entity.Name = request.Name;
            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
