using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper.QueryableExtensions;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Mappings;
using booking.Application.Common.Models;
using booking.Application.Common.Security;
using booking.Application.TodoLists.Queries.GetTodos;
using booking.Domain.Enums;
using MediatR;

namespace booking.Application.Users.Queries.GetUsers
{
    [MediatrInject(MediatrServiceType.ApplicationDbContext, MediatrServiceType.CurrentUserService, MediatrServiceType.IdentityService, MediatrServiceType.Mapper)]
    [Permission(UserPermission.AccountManagement)]
    public class GetAllUsersWithPage : IRequest<PaginatedList<SimpleUser>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 100;
    }

    public partial class GetAllUsersWithPageHandler
    {
        public async Task<PaginatedList<SimpleUser>> Handle(GetAllUsersWithPage request, CancellationToken cancellationToken)
        {
            var res = await _identityService.GetUserIdsPaged(request.PageNumber, request.PageSize);
            return res;
        }
    }
}