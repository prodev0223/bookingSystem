using booking.Application.TodoLists.Queries.ExportTodos;
using System.Collections.Generic;

namespace booking.Application.Common.Interfaces
{
    public interface ICsvFileBuilder
    {
        byte[] BuildTodoItemsFile(IEnumerable<TodoItemRecord> records);
    }
}
