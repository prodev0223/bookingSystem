using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using booking.Application.Rooms.Commands.CreateRooms;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.UserRoles.Commands.CreateUserRole
{
    public class CreateUserRoleCommandValidator : AbstractValidator<CreateUserRoleCommand>
    {
        private IApplicationDbContext _context;
        private IApplicationDbContext _applicationDbContext;
        private ICurrentUserService _currentUserService;

        public CreateUserRoleCommandValidator(IApplicationDbContext context,
        IApplicationDbContext applicationDbContext,
        ICurrentUserService currentUserService
        )
        {
            _context = context;
            _currentUserService = currentUserService;
            _applicationDbContext = applicationDbContext;

            RuleFor(v => v.Name)
               .MaximumLength(1000)
               .NotEmpty()
               .MustAsync(BeUniqueName).WithMessage("Room must have unique name");
            //RuleFor(v => v).MustAsync()
        }


        public async Task<bool> BeUniqueName(string name, CancellationToken cancellationToken)
        {
            return await _context.AppUserRoles.AllAsync(l => l.Name != name);
        }
    }
}