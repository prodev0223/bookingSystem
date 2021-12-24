using System.Collections.Generic;
using System.Data;
using booking.Application.Common.Interfaces;
using booking.Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using booking.Application.Common.Mappings;
using booking.Application.Users.Queries.GetUsers;
using booking.Domain.Entities;
using booking.Domain.Enums;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using booking.Application.AuditLog.Queries.Audit;

namespace booking.Infrastructure.Identity
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<ApplicationUser>                 _userManager;
        private readonly IUserClaimsPrincipalFactory<ApplicationUser> _userClaimsPrincipalFactory;
        private readonly IAuthorizationService                        _authorizationService;
        private readonly IApplicationDbContext                        _applicationDbContext;
        private readonly ICurrentUserService _currentUserService;

        public IdentityService(
            UserManager<ApplicationUser>                 userManager,
            IApplicationDbContext applicationDbContext,
            IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory,
            ICurrentUserService currentUserService,
            IAuthorizationService                        authorizationService)
        {
            _userManager                = userManager;
            _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
            _authorizationService       = authorizationService;
            _applicationDbContext = applicationDbContext;
            _currentUserService = currentUserService;
        }

        public async Task<string> GetUserNameAsync(string userId)
        {
            var user = await _userManager.Users.FirstAsync(u => u.Id == userId);

            return user.UserName;
        }

        public Task<Result> HasSystemPermissionAsync(IEnumerable<UserPermission> mustHave)
        {
            var userId = _currentUserService.UserId;
            var permissionSets = _applicationDbContext.UserGroups
                .Where(ur => ur.UserRoles.Any(r => r.RoomSet.SoftwareSystem == true))
                .SelectMany(r => r.UserRoles)
                .Include(r => r.PermissionSet)
                .Include(r => r.RoomSet).AsNoTracking();
#if DEBUG
            // TODO QUERY TOO COMPLEX
            var xx = permissionSets.ToQueryString();
#endif
            var permissionSetsList = permissionSets.ToList();
            foreach (var p in permissionSetsList)
            {
                var ok = PermissionCheck(p.PermissionSet, mustHave);
                if (ok.haveAll)
                {
                    return Task.FromResult(Result.Success());
                }
            }
            
            return Task.FromResult(Result.Failure(new[] { "HasRoomIdPermissionAsync" }));
        }

        public async Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password)
        {
            var user = new ApplicationUser
            {
                UserName = userName,
                Email    = userName,
            };

            var result = await _userManager.CreateAsync(user, password);

            return (result.ToApplicationResult(), user.Id);
        }

        public async Task<bool> IsInRoleAsync(string userId, string role)
        {
            var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

            return await _userManager.IsInRoleAsync(user, role);
        }
        
        public async Task<string> GetUserEmailById(string userId, CancellationToken ct)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.Id == userId, ct);

            return user.Email;
        }

        public async Task<bool> AuthorizeAsync(string userId, string policyName)
        {
            var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

            var principal = await _userClaimsPrincipalFactory.CreateAsync(user);

            var result = await _authorizationService.AuthorizeAsync(principal, policyName);

            return result.Succeeded;
        }

        public async Task<Result> HasPermissionAsync(string userId, Room room, IEnumerable<UserPermission> permission, bool permissionBypass = false,
                                                     bool   roomBypass = false)
        {
            if (room is null && !roomBypass)
            {
                return Result.Failure(new[] {$"Permission definition error"});
            }

            var roles = _applicationDbContext.UserGroupApplicationUsers
                .Where(ur => ur.ApplicationUserId == userId)
                .SelectMany(ur => ur.UserGroup.UserRoles)
                .Include(r => r.PermissionSet)
                .Include(r => r.RoomSet);
            #if DEBUG
            var x = roles.ToQueryString();
            #endif

            foreach (UserRole uRole in roles)
            {
                bool hasRoom = false;
                if (!roomBypass)
                {
                    hasRoom = uRole.RoomSet.Rooms.Any(m => m.Id == room.Id);
                }
                if (roomBypass || hasRoom || uRole.RoomSet.AllRooms)
                {
                    var missingperm = permission.Except(uRole.PermissionSet.Permissions);

                    if (uRole.PermissionSet.Permissions.Contains(UserPermission.AllPermission) || !missingperm.Any())
                    {
                        return Result.Success();
                    }
                }
            }

            return Result.Failure(new[] {$"User doesn't have permission [{string.Join(", ", permission)}] in {room?.Name} ID: {room?.Id}"});
            //UserRole? role = user.UserRoles.FirstOrDefault(r => r.SchoolUnit == schoolUnit);
        }

        public async Task<(IDictionary<UserPermission, bool>, bool)> HasRoomPermissionAsync(int roomId, IEnumerable<UserPermission> mustHave)
        {
            var userId = _currentUserService.UserId;

            var roles = _applicationDbContext.UserGroupApplicationUsers
                .Where(ur => ur.ApplicationUserId == userId)
                .SelectMany(ur => ur.UserGroup.UserRoles)
                .Include(xy => xy.UserGroups)
                .Include(r => r.PermissionSet)
                .Where(r => r.RoomSet.AllRooms == true || r.RoomSet.Rooms.Contains(new Room { Id = roomId }))
                .Include(r => r.RoomSet)
                .AsNoTracking();
#if DEBUG
            var xx = roles.ToQueryString();
#endif
            IDictionary<UserPermission, bool> resDetailed = mustHave.Distinct().ToDictionary(t => t, (_) => false);
            IList<UserPermission> needToHave = mustHave.ToList();
            var roleList = roles.ToList();
            foreach (var p in roles)
            {
                foreach (var userGroup in p.UserGroups)
                {
                    foreach (var s in userGroup.UserRoles)
                    {
                        var v = PermissionCheck(s.PermissionSet, needToHave);
                        if (v.haveAll)
                        {
                            return v;
                        }
                        else
                        {
                            resDetailed = v.res;
                        }
                    }
                }
            }

            return (resDetailed, false);
        }

        public async Task<(IDictionary<UserPermission, bool>, bool)> HasBookingIdPermissionAsync(int bookingId, IEnumerable<UserPermission> mustHave, bool permissionBypass = false,
            bool roomBypass = false)
        {
            var roomIds = _applicationDbContext.Bookings
                .Where(b => b.Id == bookingId)
                .Include(ur => ur.Room).Select(bb => bb.Room.Id)
                .ToList();
            if (!roomIds.Any())
            {
                var tDict = new Dictionary<UserPermission, bool>();
                foreach (var p in mustHave)
                {
                    tDict[p] = false;
                }
                return (tDict, false);
            }
            var res = await HasRoomPermissionAsync(roomIds[0], mustHave);
            return res;
        }

        public async Task<Result> DeleteUserAsync(string userId)
        {
            var user = _userManager.Users.SingleOrDefault(u => u.Id == userId);

            if (user != null)
            {
                return await DeleteUserAsync(user);
            }

            return Result.Failure(new[]{"no user with this id"});
        }

        public async Task<Result> DeleteUserAsync(ApplicationUser user)
        {
            var result = await _userManager.DeleteAsync(user);

            return result.ToApplicationResult();
        }

        public async Task<(Result res, IList<UserRole> role)> GetUserRoles(string userId)
        {
            throw new KeyNotFoundException();
        }

        public async Task<(Result res, IEnumerable<SimpleUser> getUserIds)> GetUserIds()
        {
            var res = await _userManager.Users.ToListAsync();
            return (Result.Success(), res.Select( r => new SimpleUser
            {
                UserId = r.Id,
                Username = r.UserName,
                UserEmail = r.Email,
            }));
        }
        
        public async Task<PaginatedList<SimpleUser>> GetUserIdsPaged(int pageNumber, int pageSize)
        {
            var res = await _userManager.Users
                .OrderBy(x => x.Id)
                .Select(r =>
                    new SimpleUser
                    {
                        UserId = r.Id,
                        Username = r.UserName,
                    }
                )
                .PaginatedListAsync(pageNumber, pageSize);
            return res;
        }
        
        private (IDictionary<UserPermission, bool> res, bool haveAll) PermissionCheck(PermissionSet have, IEnumerable<UserPermission> needToHave)
        {
            bool resHaveAll = true;
            Dictionary<UserPermission, bool> res = new();
            var allPermission = have.Permissions.Contains(UserPermission.AllPermission);
            res[UserPermission.AllPermission] = allPermission;
            
            foreach (var i in needToHave)
            {
                res[i] = allPermission || have.Permissions.Contains(i);
                resHaveAll = resHaveAll && res[i];
            }

            return (res, resHaveAll);
        }
        
        public async Task<IEnumerable<PermissionSet>>GetUserSystemPermission(string userId)
        {
            var a = await
                _applicationDbContext.UserGroupApplicationUsers.Where(xx =>
                        xx.ApplicationUserId == _currentUserService.UserId &&
                        xx.UserGroup.UserRoles.Any(i => i.RoomSet.SoftwareSystem))
                    .SelectMany(j => j.UserGroup.UserRoles.Select(xxx => xxx.PermissionSet))
                    .ToListAsync() ;
            //
            return a;
        }
        public async Task<(Result res, IEnumerable<UserInfomodel> UserInfo)> UserInfo()
        {
            var res = await _userManager.Users.ToListAsync();
            return (Result.Success(), res.Select(r => new UserInfomodel
            {
                Id = r.Id,
                UserName = r.UserName,
                NormalizedUserName = r.NormalizedUserName,
                NormalizedEmail = r.NormalizedEmail,
                PhoneNumber = r.PhoneNumber,
            }));
        }

        public async Task<(Result res, IEnumerable<AuditlogModel> AuditInfo)> AuditInfo()
        {
            AuditlogModel model = new AuditlogModel();
            var res = await _userManager.Users.ToListAsync();
            return (Result.Success(), res.Select(r => new AuditlogModel
            {
                Id = model.Id,
                Rooms = model.Rooms,
                RoomExtraFields = model.RoomExtraFields,
                PermissionGroups = model.PermissionGroups,
                UserGroups = model.UserGroups,
                SMTPServerSetting = model.SMTPServerSetting,
                Booking = model.Booking,
            }));

        }

        public async Task<IEnumerable<UserGroup>> GetUserRoomsPermission(string userId, CancellationToken ct)
        {
            //var list = await 
            //    _applicationDbContext.UserGroupApplicationUsers.Include(xx =>
            //            xx.ApplicationUserId == _currentUserService.UserId)
            //        .Select(i => i.UserGroup)
            //        .Include(j => j.UserRoles)
            //        .ThenInclude(k => k.Permission)
            //        .Include(j => j.UserRoles)
            //        .ThenInclude(k => k.RoomSet).ToListAsync(ct);
            ////
            throw new NoNullAllowedException();
            //return list;
         //dto.BuildAdapter()
         //    .EntityFromContext(db)
         //    .AdaptTo(poco);;   
        }
    }
}