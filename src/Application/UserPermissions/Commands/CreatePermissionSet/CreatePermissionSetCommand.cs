using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Domain.Enums;
using MediatR;
using PermissionSet = booking.Domain.Entities.PermissionSet;

namespace booking.Application.UserPermissions.Commands.CreatePermissionSet
{
    [MediatrInject(MediatrServiceType.ApplicationDbContext)]
    public class CreatePermissionSetCommand : IRequest<int>
    {
        [Unique("PermissionSet")]
        public string Name { get; set; }

        public IList<int> Permissions { get; set; } = new List<int>();
        public bool AllPermission { get; set; }
    }

    public partial class CreatePermissionSetCommandHandler
    {
        public async Task<int> Handle(CreatePermissionSetCommand request, CancellationToken cancellationToken)
        {
            if (request.Permissions?.Count == 0 && request.AllPermission == false)
            {
                throw new NotSupportedException("Empty Permission");
            }

            var entity = new PermissionSet
            {
                Name = request.Name,
            };

            var newPermissionList = new List<UserPermission>();
            if (request.Permissions != null)
            {
                newPermissionList.AddRange(request.Permissions.Select(one => (UserPermission)one));
            }

            if (request.AllPermission)
            {
                newPermissionList = new List<UserPermission>() { UserPermission.AllPermission };
            }

            entity.Permissions = newPermissionList;
            _applicationDbContext.PermissionSet.Add(entity);
            await _applicationDbContext.SaveChangesAsync(cancellationToken);
            
            return entity.Id;
        }
    }
}