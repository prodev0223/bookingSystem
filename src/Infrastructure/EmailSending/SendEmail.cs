using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Models;
using booking.Infrastructure.ServiceHelper;
using Hangfire;

namespace booking.Infrastructure.EmailSending
{
    public class SendEmail : ISendEmail
    {
        private readonly IBookingService _bookingService;
        private readonly IIdentityService _identityService;

        public SendEmail(IBookingService bookingService, IIdentityService identityService)
        {
            _identityService = identityService;
            _bookingService = bookingService;
        }

        public async Task<Result> BookingConfirmed(int bookingId, CancellationToken ct)
        {
            var bookingInfo = await _bookingService.GetBookings(bookingId, ct);
            var userInfoLs = bookingInfo.BookingApplicationUser.Select(i => i.ApplicationUserId);
            foreach (var uid in userInfoLs)
            {
                var userEmail = await _identityService.GetUserEmailById(uid, ct);
                var jid = BackgroundJob.Enqueue<EmailSendingService>(fw =>
                    fw.SendSimpleEmail($"Booking {bookingId}", $"Booking {bookingId}", userEmail));
            }

            //var uid2 = BackgroundJob.Enqueue<SendEmail>(fw =>
            //    fw.BookingCancelled($"Booking {bookingId}", $"Booking {bookingId}"));
            return Result.Success();
        }

        public Task<Result> BookingCancelled(int bookingId, CancellationToken ct)
        {
            throw new System.NotImplementedException();
        }

        public async Task<Result> BookingChanged(int bookingId, CancellationToken ct)
        {
            var bookingInfo = await _bookingService.GetBookings(bookingId, ct);
            var userInfoLs = bookingInfo.BookingApplicationUser.Select(i => i.ApplicationUserId);
            
            foreach (var uid in userInfoLs)
            {
                var userEmail = await _identityService.GetUserEmailById(uid, ct);
                var jid = BackgroundJob.Enqueue<EmailSendingService>(fw =>
                    fw.SendSimpleEmail($"Booking changed {bookingId}", $"Booking changed {bookingId}", userEmail));
            }

            //var uid2 = BackgroundJob.Enqueue<SendEmail>(fw =>
            //    fw.BookingCancelled($"Booking {bookingId}", $"Booking {bookingId}"));
            return Result.Success();
        }

        public Task<Result> BookingReminder(int bookingId)
        {
            throw new System.NotImplementedException();
        }

        public Task<Result> RoomChanges(int bookingId)
        {
            throw new System.NotImplementedException();
        }

        public Task<Result> SystemError(int bookingId)
        {
            throw new System.NotImplementedException();
        }

        public Task<Result> SystemNotification(int bookingId)
        {
            throw new System.NotImplementedException();
        }
    }
}