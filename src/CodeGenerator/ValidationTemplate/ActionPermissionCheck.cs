using System;
using System.Collections.Generic;
using System.Linq;

namespace CodeGenerator.ValidationTemplate
{
    public static class ActionPermissionTemplate
    {
        public static string UniqueCheck(string className, string field)
        {
            return $@"

                RuleFor(v => v.{field})
                   .NotEmpty().WithMessage(""{field} is required."")
                   .MustAsync(BeUnique{className}{field}).WithMessage(""The specified roomSet name already exists."");
";
        }

        public static string UniqueCheckDBAccess(string className, string field, string dbcontext)
        {
            return $@"

        public async Task<bool> BeUnique{className}{field}(string field, CancellationToken cancellationToken)
        {{
            return await _applicationDbContext.{dbcontext}
                                 .AllAsync(l => l.{field} != field);
        }}
";
        }
        public static string Body(string usingDirectivesStr, string className, string space, string rawPermissionList, bool haveRoom, bool haveBooking, IList<(string field, string db)> unique)
        {
            string msg = "";
            if (haveBooking)
            {
                msg = "Wrong Booking ID";
            }
            if (haveRoom)
            {
                msg = "Wrong Room ID";
            }
            if (!haveRoom && !haveBooking)
            {
                msg = "Wrong RoomID and Wrong booking ID";
            }
            msg = "\"" + msg + "\"";
            return $@"
//Generate FluentValidation Injection
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Interfaces;

using Microsoft.EntityFrameworkCore;
using booking.Application.Common.Models;
using booking.Domain.Enums;
using FluentValidation;
{usingDirectivesStr}
using AutoMapper;
namespace {space}
{{
    public class {className}ValidatorAutoGenPermissionCheck :AbstractValidator<{className}>
    {{
        private readonly IApplicationDbContext _applicationDbContext;
        //private readonly ICurrentUserService _currentUserService;
        private readonly IIdentityService _identityService;
        public {className}ValidatorAutoGenPermissionCheck(IIdentityService identityService, IApplicationDbContext applicationDbContext, ICurrentUserService currentUserService)
        {{
            _applicationDbContext = applicationDbContext;
        //    _currentUserService = currentUserService;
            _identityService = identityService;
            RuleFor(v => v).MustAsync(HavePermission).WithMessage({msg});
            {string.Join(
                Environment.NewLine,
                unique.Select(v =>
                    UniqueCheck(className, v.field)
                )
                
                )}
        }}

    public async Task<bool> HavePermission({className} a, CancellationToken cancellationToken)
        {{
            bool haveBooking  = true;
            {(haveBooking ? @$"
            var thaveBooking = await _identityService.HasBookingIdPermissionAsync(a.BookingId, new UserPermission[]{{{rawPermissionList}}});
            haveBooking = thaveBooking.Item2;
            ": "")}

            bool haveRoom = true;
            {(haveRoom ? @$"
            var thaveRoom = await _identityService.HasRoomPermissionAsync(a.RoomId, new UserPermission[]{{{rawPermissionList}}});
            haveRoom = thaveRoom.Item2;
            ": "")}
            Result haveSystem      = Result.Success();

            {(!haveRoom && !haveBooking ? @$"
            haveSystem = await _identityService.HasSystemPermissionAsync(new UserPermission[]{{{rawPermissionList}}});
            ": "")}
            return haveRoom &&
            haveSystem.Succeeded &&
            haveBooking;
        }}

            {string.Join(
                Environment.NewLine,
                unique.Select(v =>
                    UniqueCheckDBAccess(className, v.field, v.db)
                )
                
                )}
    }}
}}
";
        }
        
    }
}