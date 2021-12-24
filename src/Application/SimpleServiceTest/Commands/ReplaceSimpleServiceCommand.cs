using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using booking.Application.SimpleServiceTest.Commands;
using booking.Domain.Enums;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace booking.Application.SimpleServiceTest.Commands
{
    [Permission(UserPermission.AllPermission, UserPermission.AccountManagement)]
    [MediatrInject(MediatrServiceType.EmailSendingService)]
    //[AutoGenerateValidation]
    public class ReplaceSimpleServiceCommand : IRequest<string>
    {
        public string Name { get; set; }
    }

    public partial class ReplaceSimpleServiceCommandHandler
    {
        public async Task<string> Handle(ReplaceSimpleServiceCommand request,
            CancellationToken cancellationToken)
        {
            //_serviceCollection.RemoveAll<ISimpleService>();
            var res = await _emailSendingService.SendSimpleEmail(request.Name, "body", "hugo@ast-hk.com");
            return res;
        }
    }
}