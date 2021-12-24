using booking.Domain.Common;
using System.Threading.Tasks;

namespace booking.Application.Common.Interfaces
{
    public interface IDomainEventService
    {
        Task Publish(DomainEvent domainEvent);
    }
}
