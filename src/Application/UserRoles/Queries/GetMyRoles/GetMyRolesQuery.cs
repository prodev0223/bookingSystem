using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.UserRoles.Queries.GetMyRoles
{
    [Permission(UserPermission.BookingViewMyBooking)]
    [MediatrInject(
        MediatrServiceType.ApplicationDbContext,
        MediatrServiceType.CurrentUserService
        )]
    public class GetMyGruopQuery : IRequest<IEnumerable<UserGroup>>
    {
    }

    public partial class GetMyGruopQueryHandler
    {
        public async Task<IEnumerable<UserGroup>> Handle(GetMyGruopQuery request, CancellationToken cancellationToken)
        {
            var res1 = await
                           _applicationDbContext.UserGroupApplicationUsers
                                   .Where(ur => ur.ApplicationUserId == _currentUserService.UserId)
                                   .Select(r => r.UserGroup)
                                   .ToListAsync(cancellationToken);
            return res1;
        }
    }
}