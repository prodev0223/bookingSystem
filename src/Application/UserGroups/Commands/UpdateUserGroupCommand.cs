using System.Collections.Generic;
using System.Linq;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.UserGroups.Commands
{
    [MediatrInject(MediatrServiceType.ApplicationDbContext)]
    public class UpdateUserGroupCommand : IRequest<int>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<int> UserRoleIds { get; set; }
    }

    public partial class UpdateUserGroupCommandHandler 
    {
        public async Task<int> Handle(UpdateUserGroupCommand request, CancellationToken ct)
        {
            var existing = await _applicationDbContext.UserGroups
                .Include(r => r.UserRoles)
                .SingleAsync(r => r.Id == request.Id, ct);
            existing.Name = request.Name;
            var userRoleQuery = _applicationDbContext.AppUserRoles
                .Where( r=> request.UserRoleIds.Contains(r.Id));

            existing.UserRoles = userRoleQuery.ToList();
            
            await _applicationDbContext.SaveChangesAsync(ct);
            return existing.Id;
        }
    }
}
