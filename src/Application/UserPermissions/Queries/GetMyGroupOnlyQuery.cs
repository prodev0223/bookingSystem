using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using booking.Application.Common.Interfaces;
using booking.Application.UserPermissions.Queries.GetPermissionNameList;
using booking.Domain.Enums;
using MediatR;

namespace booking.Application.UserPermissions.Queries
{
    public class GetMyGroupOnlyQuery : IRequest<IEnumerable<UserPermissionDto>>
    {
    }

    public class GetMyGroupOnlyQueryHandler : IRequestHandler<GetMyGroupOnlyQuery, IEnumerable<UserPermissionDto>>
    {
        private readonly IMapper _mapper;

        public GetMyGroupOnlyQueryHandler(
            IApplicationDbContext context,
            IMapper mapper
        )
        {
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserPermissionDto>> Handle(GetMyGroupOnlyQuery request,
                                                                 CancellationToken cancellationToken)
        {
            var userPermissionDtos = Enum.GetValues(typeof(UserPermission))
                                         .Cast<UserPermission>()
                                         .Select(p => new UserPermissionDto
                                          {
                                              Name  = p.ToString()
                                          });
            return userPermissionDtos;
        }
    }
}