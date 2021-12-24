using System.Threading;
using System.Threading.Tasks;

namespace booking.Application.Common.Interfaces
{
    public interface ISettingsService
    {
        Task<T> Get<T>(string plugin, CancellationToken cancellationToken) where T : ISettings<T>, new();
        Task Set<T>(string plugin, T value, CancellationToken cancellationToken) where T : ISettings<T>, new();
    }
}