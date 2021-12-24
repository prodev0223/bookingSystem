using booking.Application.Common.Exceptions;
using booking.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Domain.Enums;

namespace booking.Application.UserRoles.Commands.DeleteUserRole
{
    [MediatrInject(MediatrServiceType.ApplicationDbContext)]
    [Permission(UserPermission.AccountManagement)]
    public class DeleteUserRoleCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }

    public partial class DeleteUserRoleCommandHandler
    {
        public async Task<bool> Handle(DeleteUserRoleCommand request, CancellationToken cancellationToken)
        {
            if (request.Id <= 1)
            {
                return false;
            }

            var entity = await _applicationDbContext.AppUserRoles.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(UserRole), request.Id);
            }

            _applicationDbContext.AppUserRoles.Remove(entity);

            int cnt = await _applicationDbContext.SaveChangesAsync(cancellationToken);

            return cnt == 1;
        }
    }
}
