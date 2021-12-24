using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using booking.Domain;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Users.Queries.GetUsers
{
    [MediatrInject(MediatrServiceType.IdentityService)]
    [Permission(UserPermission.AccountManagement)]
    public class GetAllUsers : IRequest<IEnumerable<SimpleUser>>
    {
    }

    public partial class GetAllUsersHandler
    {
        public async Task<IEnumerable<SimpleUser>> Handle(GetAllUsers request, CancellationToken cancellationToken)
        {
            var res = await _identityService.GetUserIds();
            return res.getUserIds;
        }
    }
}