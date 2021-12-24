using booking.Application.Common.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Validator;
using booking.Domain.Enums;

namespace booking.Application.TodoLists.Commands.CreateTodoList
{
    public class CreateTodoListCommandValidator : AbstractValidator<CreateTodoListCommand>
    {
        private readonly ICurrentUserService   _currentUserService;
        private readonly IIdentityService _identityService;
        private readonly IApplicationDbContext _applicationDbContext;

        public CreateTodoListCommandValidator(IApplicationDbContext context, ICurrentUserService currentUserService,
            IIdentityService identityService) 
        {
            _applicationDbContext            = context;
            _currentUserService = currentUserService;

            RuleFor(v => v.Title)
               .NotEmpty().WithMessage("Title is required.")
               .MaximumLength(200).WithMessage("Title must not exceed 200 characters.")
               .MustAsync(BeUniqueTitle).WithMessage("The specified title already exists.");
        }

        public async Task<bool> BeUniqueTitle(string title, CancellationToken cancellationToken)
        {
            return await _applicationDbContext.TodoLists
                                 .AllAsync(l => l.Title != title);
        }
    }
}