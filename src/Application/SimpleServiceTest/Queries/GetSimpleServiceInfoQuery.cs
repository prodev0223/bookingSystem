using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Application.SimpleServiceTest.Commands;
using booking.Domain.Enums;
using MediatR;

namespace booking.Application.SimpleServiceTest.Queries
{
    [Permission(UserPermission.AllPermission, UserPermission.AccountManagement)]
    [MediatrInject(MediatrServiceType.EmailSendingService)]
    //[AutoGenerateValidation]
    public class GetSimpleServiceInfoQuery : IRequest<SimpleServiceDto>
    {
    }

    public partial class GetSimpleServiceInfoQueryHandler
    {
        public async Task<SimpleServiceDto> Handle(GetSimpleServiceInfoQuery request,
            CancellationToken cancellationToken)
        {
            // NO USE
            //var s = _simpleServiceRuntimeInject.GetSimpleService();
            var info = new SimpleServiceDto() { Name = "Name", Value = 777 };
            return info;
        }
    }
}