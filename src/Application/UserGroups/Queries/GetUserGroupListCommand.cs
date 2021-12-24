using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper.QueryableExtensions;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Application.TodoLists.Queries.GetTodos;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.UserGroups.Queries
{
    [MediatrInject(
        MediatrServiceType.ApplicationDbContext,
        MediatrServiceType.Mapper,
        MediatrServiceType.CurrentUserService
    )]
    [Permission(UserPermission.AccountManagement)]
    public class GetUserGroupListCommand : IRequest<IEnumerable<UserGroupNameDto>>
    {
    }

    public partial class GetUserGroupListCommandHandler
    {
        public async Task<IEnumerable<UserGroupNameDto>> Handle(GetUserGroupListCommand request, CancellationToken ct)
        {
            var userId = _currentUserService.UserId;
            var userGroupList = await
                _applicationDbContext.UserGroups
                    .AsNoTracking()
                    .ProjectTo<UserGroupNameDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(ct);
            return userGroupList;
        }
    }
}
