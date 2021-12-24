using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Bookings.Queries.GetAvailableBookings;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Models;
using booking.Domain.Entities;
using booking.Domain.Enums;
using booking.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace booking.Infrastructure.BookingActions
{
    public class BookingAction : IBookingAction
    {
        private readonly IUserClaimsPrincipalFactory<ApplicationUser> _userClaimsPrincipalFactory;
        private readonly IAuthorizationService _authorizationService;
        private readonly IApplicationDbContext _applicationDbContext;
        private readonly ICurrentUserService _currentUserService;
        private readonly UserManager<ApplicationUser> _userManager;

        public BookingAction(
            UserManager<ApplicationUser> userManager,
            IApplicationDbContext applicationDbContext,
            IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory,
            ICurrentUserService currentUserService,
            IAuthorizationService authorizationService)
        {
            _userManager = userManager;
            _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
            _authorizationService = authorizationService;
            _applicationDbContext = applicationDbContext;
            _currentUserService = currentUserService;
        }

        public async Task<Result> NewAsync(Booking b, IEnumerable<string> userIds, CancellationToken ct)
        {
            _applicationDbContext.Bookings.Add(b);
            
            var bookingId = await _applicationDbContext.SaveChangesAsync(ct);
            
            await _applicationDbContext.BookingApplicationUsers.AddRangeAsync(userIds.Select(u =>
            new BookingApplicationUser{ApplicationUserId = _currentUserService.UserId, BookingId = b.Id}), ct);

            var cnt = await _applicationDbContext.SaveChangesAsync(ct);
            if (cnt != 0)
            {
                return Result.Success();
            }
            return Result.Failure(new string[]{"Failed"});
            // TODO send email
        }

        public async Task<Result> CancelAsync(int bookingId, CancellationToken ct)
        {
            var booking =
                await _applicationDbContext.Bookings.FindAsync(new object[] {bookingId}, ct);
            if (booking is null)
            {
                return Result.Failure(new string[]{"Non existing id XXX"});
            }

            booking.BookingStatus = BookingStatus.Cancelled;
            // TODO send email

            await _applicationDbContext.SaveChangesAsync(ct);

            return Result.Success();
        }

        public Task<Result> ApproveAsync(int bookingId, CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        public Task<Result> RejectAsync(int bookingId, CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        public Task<Result> EditAsync(int bookingId, Booking newBooking, CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        public Task<IList<Booking>> MyBookingsAsync(DateTime startPeriod, DateTime endPeriod, CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        public Task<IList<SimpleBookingDto>> MyPossibleBookingsAsync(DateTime startPeriod, DateTime endPeriod, CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        public Task<IList<Booking>> MyBookableRangeAsync(DateTime startPeriod, DateTime endPeriod, CancellationToken ct)
        {
            throw new NotImplementedException();
        }
    }
}