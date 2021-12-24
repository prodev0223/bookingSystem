using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using booking.Application.TodoLists.Queries.GetTodos;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.UserRoles.Queries
{
    [MediatrInject(
        MediatrServiceType.ApplicationDbContext, MediatrServiceType.Mapper, MediatrServiceType.CurrentUserService)]
    [Permission(UserPermission.AllPermission)]
    public class GetAllUserRoles : IRequest<IEnumerable<UserRole>>
    {
    }
    
    public partial class GetAllUserRolesHandler 
    {
        public async Task<IEnumerable<UserRole>> Handle(GetAllUserRoles request, CancellationToken ct)
        {
            var res = await _applicationDbContext.AppUserRoles.ToListAsync(ct);
            return res;
        }
    }
}
