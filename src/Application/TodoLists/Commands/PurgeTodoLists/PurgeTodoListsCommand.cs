using System;
using System.Linq;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Security;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using booking.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.TodoLists.Commands.PurgeTodoLists
{
    [Permission(UserPermission.BookingModifyCancel, UserPermission.BookingMakeFixedTime)]
    public class PurgeTodoListsCommand : IRequest
    {
    }

    public class PurgeTodoListsCommandHandler : IRequestHandler<PurgeTodoListsCommand>
    {
        private readonly IApplicationDbContext _context;

        public PurgeTodoListsCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(PurgeTodoListsCommand request, CancellationToken cancellationToken)
        {
            _context.TodoLists.RemoveRange(_context.TodoLists);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
