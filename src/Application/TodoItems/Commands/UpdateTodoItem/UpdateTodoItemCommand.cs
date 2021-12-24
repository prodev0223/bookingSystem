using booking.Application.Common.Exceptions;
using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using NetCasbin.Rbac;

namespace booking.Application.TodoItems.Commands.UpdateTodoItem
{
    public class UpdateTodoItemCommand : IRequest
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public bool Done { get; set; }
    }

    public class UpdateTodoItemCommandHandler : IRequestHandler<UpdateTodoItemCommand>
    {
        private readonly IApplicationDbContext _context;
        
        private readonly ICurrentUserService _currentUserService;
        
        private readonly RoleManager<IdentityRole> _roleManager;
        
        
        public UpdateTodoItemCommandHandler(IApplicationDbContext context, RoleManager<IdentityRole> roleManager, ICurrentUserService currentUserService)
        {
            _context = context;
            _roleManager = roleManager;
            _currentUserService = currentUserService;
        }

        public async Task<Unit> Handle(UpdateTodoItemCommand request, CancellationToken cancellationToken)
        {
            //var list = _userManager.FindByIdAsync(_currentUserService.UserId);
            //_userManager.GetRolesAsync(_currentUserService.UserId);
            var entity = await _context.TodoItems.FindAsync(request.Id);

            if (entity == null)
            {
                throw new NotFoundException(nameof(TodoItem), request.Id);
            }

            entity.Title = request.Title;
            entity.Done = request.Done;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
