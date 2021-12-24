using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Models;
using booking.Domain.Enums;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace booking.Application.Rooms.Commands.UpdateRoom
{
    public class UpdateRoomCommandValidator : AbstractValidator<UpdateRoomCommand>
    {
        private readonly IApplicationDbContext _context;
        private readonly IIdentityService _identityService;

        public UpdateRoomCommandValidator(IApplicationDbContext context, IIdentityService identityService)
        {
            _identityService = identityService;
            _context = context;
            RuleFor(v => v.Name)
                .MaximumLength(1000)
                .NotEmpty()
                .MustAsync(BeUniqueName).WithMessage("Room must have unique name");
            RuleFor(v => v).MustAsync(HavePermission).WithMessage("Wrong RoomID and Wrong booking ID");
        }

        public async Task<bool> HavePermission(UpdateRoomCommand a, CancellationToken cancellationToken)
        {
            Result haveSystem = await _identityService.HasSystemPermissionAsync(new UserPermission[]
                { UserPermission.FacilityManagement });

            return haveSystem.Succeeded;
        }

        public async Task<bool> BeUniqueName(UpdateRoomCommand model, string title, CancellationToken cancellationToken)
        {
            return await _context.Rooms
                .Where(l => l.Id != model.RoomId)
                .AllAsync(l => l.Name != title);
        }
    }
}