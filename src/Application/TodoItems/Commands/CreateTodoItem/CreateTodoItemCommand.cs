using booking.Application.Common.Interfaces;
using booking.Domain.Entities;
using booking.Domain.Events;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Application.Common.Security;
using booking.Domain.Enums;

namespace booking.Application.TodoItems.Commands.CreateTodoItem
{
    
    [Permission(UserPermission.AllPermission, UserPermission.AccountManagement)]
    [MediatrInject(MediatrServiceType.ApplicationDbContext, MediatrServiceType.IdentityService)]
    //[AutoGenerateValidation]
    public class CreateTodoItemCommand : IRequest<int>
    {
        public int ListId { get; set; }
        
        
        public int BookingId { get; set; }

        public string Title { get; set; }
    }

    public partial class CreateTodoItemCommandHandler 
    {
        public async Task<int> Handle(CreateTodoItemCommand request, CancellationToken cancellationToken)
        {
            var entity = new TodoItem
            {
                ListId = request.ListId,
                Title = request.Title,
                Done = false
            };

            entity.DomainEvents.Add(new TodoItemCreatedEvent(entity));

            _applicationDbContext.TodoItems.Add(entity);

            await _applicationDbContext.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
