using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using booking.Application.UserPermissions.Commands.CreatePermissionSet;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PermissionSet = booking.Domain.Entities.PermissionSet;

namespace booking.Application.UserPermissions.Commands.UpdatePermissionSet
{
    [MediatrInject(MediatrServiceType.ApplicationDbContext, MediatrServiceType.HashIdService)]
    [Permission(UserPermission.FacilityManagement)]
    public class UpdatePermissionSetCommand : IRequest<int>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool AllPermission { get; set; }

        public IList<int> Permissions { get; set; }
    }

    public partial class UpdatePermissionSetCommandHandler 
    {
        public async Task<int> Handle(UpdatePermissionSetCommand request, CancellationToken cancellationToken)
        {
            if (request.Permissions?.Count == 0 && !request.AllPermission) 
            {
                throw new NotSupportedException("Empty Permission");
            }

            var existing = await _applicationDbContext.PermissionSet.FirstAsync(p => p.Id == request.Id, cancellationToken);

            if (existing is null)
            {
                throw new NotSupportedException("Non existing");
            }

            var newPermissionList = new List<UserPermission>();
            if (request.Permissions != null)
            {
                newPermissionList.AddRange(request.Permissions.Select(one => (UserPermission)one));
            }

            if (request.AllPermission)
            {
                newPermissionList = new List<UserPermission>() { UserPermission.AllPermission };
            }

            existing.Permissions = newPermissionList;
            existing.Name = request.Name;

            await _applicationDbContext.SaveChangesAsync(cancellationToken);

            return existing.Id;
        }
    }
}
