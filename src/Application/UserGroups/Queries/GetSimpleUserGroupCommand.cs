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
    public class GetSimpleUserGroupCommand : IRequest<IEnumerable<UserGroupNameDto>>
    {
        public string UserId { get; set; }
    }

    public partial class GetSimpleUserGroupCommandHandler
    {
        public async Task<IEnumerable<UserGroupNameDto>> Handle(GetSimpleUserGroupCommand request, CancellationToken ct)
        {
            var userId = _currentUserService.UserId;
            var userGroupList = await
                _applicationDbContext.UserGroups
                    .Where(r => r.UserGroupApplicationUsers.Any(i => i.ApplicationUserId == request.UserId))
                    .AsNoTracking()
                    .ProjectTo<UserGroupNameDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(ct);
            return userGroupList;
        }
    }
}