using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Models;

namespace booking.Application.Common.Interfaces
{
    public interface ISendEmail
    {
        #region BookingActions

        public Task<Result> BookingConfirmed(int bookingId, CancellationToken ct);

        public Task<Result> BookingCancelled(int bookingId, CancellationToken ct);

        public Task<Result> BookingChanged(int bookingId, CancellationToken ct);

        public Task<Result> BookingReminder(int bookingId);

        #endregion

        #region SystemActions

        public Task<Result> RoomChanges(int bookingId);

        public Task<Result> SystemError(int bookingId);

        public Task<Result> SystemNotification(int bookingId);

        #endregion
    }
}