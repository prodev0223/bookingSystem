using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using booking.Application.Common.Interfaces;
using booking.Application.TodoLists.Queries.GetTodos;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.UserPermissions.Queries.GetPermissionNameList
{
    public class GetPermissionListQuery : IRequest<IEnumerable<UserPermissionDto>>
    {
    }

    public class GetPermissionListQueryHandler : IRequestHandler<GetPermissionListQuery, IEnumerable<UserPermissionDto>>
    {
        private readonly IMapper _mapper;

        private readonly IHashIdService _hashIdService;

        private readonly ICurrentUserService _currentUserService;

        public GetPermissionListQueryHandler(
            IApplicationDbContext context,
            IMapper mapper,
            IHashIdService hashIdService,
            ICurrentUserService currentUserService
        )
        {
            _mapper = mapper;
            _hashIdService = hashIdService;
            _currentUserService = currentUserService;
        }

        public async Task<IEnumerable<UserPermissionDto>> Handle(GetPermissionListQuery request,
            CancellationToken cancellationToken)
        {
            var userPermissionDtos = Enum.GetValues(typeof(UserPermission))
                .Cast<UserPermission>()
                .Select(p => new UserPermissionDto
                {
                    Value = _hashIdService.Encode((int)p),
                    Name = p.ToString(),
                    Id = (int)p,
                    
                });
            return userPermissionDtos;
        }
    }
}