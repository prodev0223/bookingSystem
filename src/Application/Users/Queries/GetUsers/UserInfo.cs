using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using booking.Domain;
using booking.Domain.Entities;
using booking.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Users.Queries.GetUsers
{
    [MediatrInject(MediatrServiceType.IdentityService)]
    [Permission(UserPermission.AccountManagement)]

        public class UserInfo : IRequest<IEnumerable<UserInfomodel>>
        {
        }

        public partial class UserInfoHandler
        {
            public async Task<IEnumerable<UserInfomodel>> Handle(UserInfo request, CancellationToken cancellationToken)
            {
                var res = await _identityService.UserInfo();
                return res.UserInfo;
            }
        }
    }

