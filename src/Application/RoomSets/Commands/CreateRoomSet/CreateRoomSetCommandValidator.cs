using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.RoomSets.Commands.CreateRoomSet
{
    public class CreateRoomSetCommandsValidator : AbstractValidator<CreateRoomSetCommand>
    {
        private readonly IApplicationDbContext _context;

        public CreateRoomSetCommandsValidator(IApplicationDbContext context)
        {
            _context = context;

        //    RuleFor(v => v.Name)
        //       .NotEmpty().WithMessage("Name is required.")
        //       .MustAsync(BeUniqueTitle).WithMessage("The specified roomSet name already exists.");
        }

        public async Task<bool> BeUniqueTitle(string name, CancellationToken cancellationToken)
        {
            return await _context.RoomSets
                                 .AllAsync(l => l.Name != name);
        }
    }
}