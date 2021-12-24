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

namespace booking.Application.AuditLog.Queries.Audit
{
   [MediatrInject(MediatrServiceType.IdentityService)]
   [Permission(UserPermission.AccountManagement)]
    public class Audit : IRequest<IEnumerable<AuditlogModel>>
    {
    }

    public partial class AuditHandler
    {
        public async Task<IEnumerable<AuditlogModel>> Handle(Audit request, CancellationToken cancellationToken)
        {
            var res = await _identityService.AuditInfo();
            return res.AuditInfo;
        }
    }
}
