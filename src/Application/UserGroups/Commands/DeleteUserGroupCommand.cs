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
    [Permission(UserPermission.AccountManagement)]
    public class DeleteUserGroupCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }

    public partial class DeleteUserGroupCommandHandler
    {
        public async Task<bool> Handle(DeleteUserGroupCommand request, CancellationToken ct)
        {
            if (request.Id <= 1)
            {
                return false;
            }

            _applicationDbContext.UserGroups.Remove(new UserGroup { Id = request.Id });
            int cnt = await _applicationDbContext.SaveChangesAsync(ct);
            return cnt == 1;
        }
    }
}
