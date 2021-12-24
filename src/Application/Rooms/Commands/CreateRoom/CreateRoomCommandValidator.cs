using System;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Rooms.Commands.CreateRooms
{
    public class CreateRoomCommandValidator : AbstractValidator<CreateRoomCommand>
    {
        private readonly IApplicationDbContext _context;

        public CreateRoomCommandValidator(IApplicationDbContext context)
        {
            _context = context;
            RuleFor(v => v.Name)
               .MaximumLength(1000)
               .NotEmpty()
               .MustAsync(BeUniqueName).WithMessage("Room must have unique name");
        }

        public async Task<bool> BeUniqueName(string name, CancellationToken cancellationToken)
        {
            return await _context.Rooms
                                 .AllAsync(l => l.Name != name);
        }

    }
}