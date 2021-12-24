using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.UserRoles.Queries
{
    [Permission(UserPermission.BookingViewMyBooking)]
    [MediatrInject(
        MediatrServiceType.ApplicationDbContext,
        MediatrServiceType.CurrentUserService
        )]
    public class GetRolesById : IRequest<UserRole>
    {
        public int Id { get; set; }
    }

    public partial class GetRolesByIdHandler
    {
        public async Task<UserRole> Handle(GetRolesById request, CancellationToken ct)
        {
            var res1 = await
                _applicationDbContext.AppUserRoles
                    .Include(r => r.PermissionSet)
                    .Include(r => r.RoomSet)
                    .SingleAsync(r => r.Id == request.Id, ct);
            return res1;
        }
    }
}