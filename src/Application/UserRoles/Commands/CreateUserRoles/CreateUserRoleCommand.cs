using System.Collections.Generic;
using System.Linq;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using booking.Domain.Events;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Security;
using booking.Domain.Enums;

namespace booking.Application.UserRoles.Commands.CreateUserRole
{
    //[Permission(UserPermission.FacilityTypeManagement)]
    public class CreateUserRoleCommand : IRequest<int>
    {
        public string Name { get; set; }

        public int PermissionSetId { get; set; }

        public int RoomSetId { get; set; }
    }

    public class CreateUserRoleCommandHandler : IRequestHandler<CreateUserRoleCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateUserRoleCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateUserRoleCommand request, CancellationToken cancellationToken)
        {
            var entity = new UserRole
            {
                Name         = request.Name,
                PermissionSetId = request.PermissionSetId,
            };
            entity.RoomSetId = request.RoomSetId;

            _context.AppUserRoles.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}