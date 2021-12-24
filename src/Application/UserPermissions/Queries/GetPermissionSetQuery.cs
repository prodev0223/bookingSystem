using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PermissionSet = booking.Domain.Entities.PermissionSet;

namespace booking.Application.UserPermissions.Queries
{
    [MediatrInject(MediatrServiceType.ApplicationDbContext, MediatrServiceType.HashIdService)]
    [Microsoft.AspNetCore.Authorization.Authorize]
    [Permission(UserPermission.AccountManagement)]
    public class GetPermissionSetQueries : IRequest<PermissionSet>
    {
        public int Id { get; set; }
    }

    public partial class GetPermissionSetQueriesHandler
    {
        public async Task<PermissionSet> Handle(GetPermissionSetQueries request, CancellationToken ct)
        {
            var res = 
            await _applicationDbContext.PermissionSet.SingleAsync(r => r.Id == request.Id, ct);
            return res;
        }
    }
}