using MediatR;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace booking.Application.HFire.Commands.DITest
{
    public class DInjectCommand : IRequest<int>
    {
        public string Name { get; set; }
    }
    public class DInjectCommandHandler : IRequestHandler<DInjectCommand, int>
    {
        private readonly IMediator mediator = null;

        public DInjectCommandHandler(IMediator mediator)
        {
            this.mediator = mediator;
        }

        Task<int> IRequestHandler<DInjectCommand, int>.Handle(DInjectCommand request, CancellationToken cancellationToken)
        {
            return Task.FromResult<int>(1);
        }
    }
}
