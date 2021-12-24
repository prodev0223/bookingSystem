using AutoMapper;
using AutoMapper.QueryableExtensions;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Mappings;
using booking.Application.Common.Models;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Attributes;
using booking.Domain.Enums;

namespace booking.Application.TodoItems.Queries.GetTodoItemsWithPagination
{
    using booking.Application.TodoLists.Queries.GetTodos;
    
    [MediatrInject(MediatrServiceType.Mapper,
        MediatrServiceType.CurrentUserService,MediatrServiceType.ApplicationDbContext,  MediatrServiceType.HashIdService)]
    public class GetTodoItemsWithPaginationQuery : IRequest<PaginatedList<TodoItemDto>>
    {
        public int ListId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public partial class GetTodoItemsWithPaginationQueryHandler
    {
        public async Task<PaginatedList<TodoItemDto>> Handle(GetTodoItemsWithPaginationQuery request, CancellationToken cancellationToken)
        {
            return await _applicationDbContext.TodoItems
                .Where(x => x.ListId == request.ListId)
                .OrderBy(x => x.Title)
                .ProjectTo<TodoItemDto>(_mapper.ConfigurationProvider)
                .PaginatedListAsync(request.PageNumber, request.PageSize); ;
        }
    }
}
