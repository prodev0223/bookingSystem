using System;
using System.Collections.Generic;
using System.Linq;

namespace CodeGenerator.ValidationTemplate
{
    public static class BookingIdValidationBody
    {
        public static string BookingIdBody(string ClassName, string namespacestr)
        {
            return 
         $@"//Auto BookingId check
//Check exist only , not a real permission check for now=========================================================================================================
//Check exist only , not a real permission check for now=========================================================================================================
//Check exist only , not a real permission check for now=========================================================================================================
//Check exist only , not a real permission check for now=========================================================================================================
//Check exist only , not a real permission check for now=========================================================================================================
//Check exist only , not a real permission check for now=========================================================================================================
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;
using booking.Domain.Enums;
using FluentValidation;

namespace {namespacestr}
{{
    public  class {ClassName}BookingIdValidatorAutoGen : AbstractValidator<{ClassName}>
    {{
        private readonly IApplicationDbContext _applicationDbContext;
        public {ClassName}BookingIdValidatorAutoGen(IApplicationDbContext applicationDbContext)
        {{
            _applicationDbContext = applicationDbContext;
            RuleFor(v => v.BookingId).MustAsync(BookingMustExist).WithMessage(""Wrong Booking ID"");
        }}
        public async Task<bool> BookingMustExist(int bookingId, CancellationToken cancellationToken)
        {{
            if (bookingId == 0)
            {{
                return false;
            }}

            var booking = await _applicationDbContext.Bookings.FindAsync(bookingId);
            if (booking is null)
            {{
                return false;
            }}

            int? roomId = booking.RoomId;
            if (roomId is null)
            {{
                return false;
            }}

            //var res = _casbinAuthor.Check(_currentUserService.UserId, roomId.ToString(),
            //    nameof(UserPermission.BookingModifyCancelViewRegional));
            return true;
        }}
    }}
}}";
        }
    }
}

        
