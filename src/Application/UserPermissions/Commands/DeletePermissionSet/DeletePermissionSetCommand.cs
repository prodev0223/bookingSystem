using System;
using System.Collections.Generic;
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

namespace booking.Application.UserPermissions.Commands.DeletePermissionSet
{
    [MediatrInject(MediatrServiceType.ApplicationDbContext, MediatrServiceType.HashIdService)]
    [Permission(UserPermission.FacilityManagement)]
    public class DeletePermissionSetCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }

    public partial class DeletePermissionSetCommandHandler
    {
        public async Task<bool> Handle(DeletePermissionSetCommand request, CancellationToken cancellationToken)
        {
            if (request.Id <= 1)
            {
                return false;
            }

            _applicationDbContext.PermissionSet.Remove(new PermissionSet { Id = request.Id });

            var cnt = await _applicationDbContext.SaveChangesAsync(cancellationToken);

            return cnt == 1;
        }
    }
}
