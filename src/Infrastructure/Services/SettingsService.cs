using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using booking.Domain;
using booking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace booking.Infrastructure.Services
{
    public class SettingsService : ISettingsService
    {
        private readonly IApplicationDbContext _applicationDbContext;

        public SettingsService(IApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public async Task<T> Get<T>(string plugin, CancellationToken cancellationToken) where T : ISettings<T>, new()
        {
            var setting =
                await _applicationDbContext.PluginSettings.FirstOrDefaultAsync(x => x.Plugin == plugin,
                    cancellationToken);
            if (setting == null)
            {
                return new T().WithDefaultValues();
            }

            var deserialized = JsonConvert.DeserializeObject(setting.Value, typeof(T));
            return (T)deserialized;
        }

        public async Task Set<T>(string plugin, T value, CancellationToken cancellationToken)
            where T : ISettings<T>, new()
        {
            var jsonValue = JsonConvert.SerializeObject(value);
            var existing =
                await _applicationDbContext.PluginSettings.FirstOrDefaultAsync(x => x.Plugin == plugin,
                    cancellationToken);
            var newExisting = new PluginSetting();
            if (existing != null)
            {
                existing.Value = jsonValue;
            }
            else
            {
                await _applicationDbContext.PluginSettings.AddAsync(PluginSetting.Create(plugin, jsonValue),
                    cancellationToken);
            }

            await _applicationDbContext.SaveChangesAsync(cancellationToken);
        }
    }
}