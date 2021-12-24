using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace booking.Application.AuditLog.Queries.Audit
{
    //[MediatrInject(MediatrServiceType.ApplicationDbContext, MediatrServiceType.Mapper, MediatrServiceType.HashIdService)]

    //public class GetAuditquery:IRequest<IEnumerable<AuditlogModel>>
    //{
    //    private readonly IApplicationDbContext _applicationDbContext;
    //}
    //public  Task<IEnumerable<AuditlogModel>> Handle(GetAuditquery request,CancellationToken cancellationToken)
    //{
    //    List<Audit> listroom = _applicationDbContext
    //        .AsNoTracking().ToListAsync(cancellationToken);
    //}
}
