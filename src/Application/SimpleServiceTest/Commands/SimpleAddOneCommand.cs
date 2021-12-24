using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Application.SimpleServiceTest.Commands;
using booking.Domain.Enums;
using MediatR;

namespace booking.Application.SimpleServiceTest.Commands
{
    [Permission(UserPermission.AllPermission, UserPermission.AccountManagement)]
    [MediatrInject(MediatrServiceType.EmailSendingService)]
    //[MediatrInject(MediatrServiceType.SimpleService)]
    //[AutoGenerateValidation]
    public class SimpleAddOneCommand : IRequest<bool>
    {
    }

    public partial class SimpleAddOneCommandHandler
    {
        public async Task<bool> Handle(SimpleAddOneCommand request,
            CancellationToken cancellationToken)
        {
            var s = _emailSendingService.GetSimpleService();
            s.AddOne();
            return true;
        }
    }
}