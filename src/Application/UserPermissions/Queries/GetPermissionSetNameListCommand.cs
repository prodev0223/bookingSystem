using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper.QueryableExtensions;
using booking.Application.Common.Attributes;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.UserPermissions.Queries
{
    [MediatrInject(
        MediatrServiceType.IdentityService,
        MediatrServiceType.CurrentUserService,
        MediatrServiceType.Mapper,
        MediatrServiceType.ApplicationDbContext
    )]
    public class GetPermissionSetNameListCommand : IRequest<IEnumerable<PermissionSetDto>>
    {
    }

    public partial class GetPermissionSetNameListCommandHandler
    {
        public async Task<IEnumerable<PermissionSetDto>> Handle(GetPermissionSetNameListCommand request,
            CancellationToken ct)
        {
            var res = await _applicationDbContext
                .PermissionSet
                .ProjectTo<PermissionSetDto>(_mapper.ConfigurationProvider)
                .AsNoTracking()
                .ToListAsync(ct);
            return res;
        }
    }
}