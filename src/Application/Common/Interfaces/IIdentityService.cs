using System.Collections.Generic;
using System.Threading;
using booking.Application.Common.Models;
using System.Threading.Tasks;
using booking.Application.Users.Queries.GetUsers;
using booking.Domain.Entities;
using booking.Domain.Enums;
using booking.Application.AuditLog.Queries.Audit;

namespace booking.Application.Common.Interfaces
{
    public interface IIdentityService
    {
        Task<string> GetUserNameAsync(string userId);

        Task<bool> IsInRoleAsync(string userId, string role);

        Task<bool> AuthorizeAsync(string userId, string policyName);

        Task<Result> HasPermissionAsync(string userId, Room room, IEnumerable<UserPermission> permission, bool permissionBypass = false,
                                        bool   roomBypass = false);
        Task<(IDictionary<UserPermission, bool>, bool)> HasRoomPermissionAsync(int roomId, IEnumerable<UserPermission> mustHavePermissions);
        Task<(IDictionary<UserPermission, bool>, bool)> HasBookingIdPermissionAsync(int bookingId, IEnumerable<UserPermission> mustHavePermissions, bool permissionBypass = false,
                                        bool   roomBypass = false);
        Task<Result> HasSystemPermissionAsync(IEnumerable<UserPermission> permission);
        Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password);

        Task<Result> DeleteUserAsync(string userId);

        Task<(Result res, IList<UserRole> role)> GetUserRoles(string userId);
        
        Task<(Result res, IEnumerable<SimpleUser> getUserIds)> GetUserIds();

        Task<PaginatedList<SimpleUser>> GetUserIdsPaged(int pageNumber, int pageSize);
        Task<IEnumerable<PermissionSet>> GetUserSystemPermission(string userId);
        Task<IEnumerable<UserGroup>> GetUserRoomsPermission(string userId, CancellationToken ct);

        Task<string> GetUserEmailById(string id, CancellationToken ct);
        Task<(Result res, IEnumerable<UserInfomodel> UserInfo)> UserInfo();
        Task<(Result res, IEnumerable<AuditlogModel> AuditInfo)> AuditInfo();
    }
}