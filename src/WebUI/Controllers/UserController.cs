using System.Collections.Generic;
using System.Threading.Tasks;
using booking.Application.Common.Models;
using booking.Application.UserGroups.Commands;
using booking.Application.UserGroups.Queries;
using booking.Application.UserGroups.Queries.GetMyUserGroup;
using booking.Application.UserRoles.Commands.CreateUserRole;
using booking.Application.UserRoles.Commands.DeleteUserRole;
using booking.Application.UserRoles.Commands.UpdateUserRole;
using booking.Application.UserRoles.Queries;
using booking.Application.UserRoles.Queries.GetMyRoles;
using booking.Application.Users.Commands;
using booking.Application.Users.Queries.GetUsers;
using booking.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace booking.WebUI.Controllers
{
    [Authorize]
    public class UserController : ApiControllerBase
    {
        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<SimpleUser>> GetUserAll()
        {
            return await Mediator.Send(new GetAllUsers());
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<PaginatedList<SimpleUser>> GetUserAllPaged(GetAllUsersWithPage query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<string> CreateUserSimple(CreateUserSimpleCommand query)
        {
            return await Mediator.Send(query);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<UserGroup>> GetMyUserGroup()
        {
            var cmd = new GetMyUserGroup();
            return await Mediator.Send(cmd);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<UserRole>> GetAllUserRole()
        {
            var cmd = new GetAllUserRoles();
            return await Mediator.Send(cmd);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<UserGroup>> GetAllUserGroups()
        {
            var cmd = new GetAllUserGroups();
            return await Mediator.Send(cmd);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<int> CreateUserRole(CreateUserRoleCommand cmd)
        {
            return await Mediator.Send(cmd);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<int> UpdateUserRole(UpdateUserRoleCommand cmd)
        {
            return await Mediator.Send(cmd);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<bool> DeleteUserRole(DeleteUserRoleCommand cmd)
        {
            return await Mediator.Send(cmd);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<bool> DeleteUserRoles(List<int> ids)
        {
            bool status = true;

            if (ids != null && ids.Count > 0)
            {
                foreach (int delId in ids)
                {
                    await Mediator.Send(new DeleteUserRoleCommand() { Id = delId });
                }
            }

            return status;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<int> CreateUserGroup(CreateUserGroupCommand cmd)
        {
            return await Mediator.Send(cmd);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<int> UpdateUserGroup(UpdateUserGroupCommand cmd)
        {
            return await Mediator.Send(cmd);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<bool> DeleteUserGroup(DeleteUserGroupCommand cmd)
        {
            return await Mediator.Send(cmd);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<bool> DeleteUserGroups(List<int> ids)
        {
            bool status = true;

            if (ids != null && ids.Count > 0)
            {
                foreach (int delId in ids)
                {
                    await Mediator.Send(new DeleteUserGroupCommand() { Id = delId });
                }
            }

            return status;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<UserGroup> GetUserGroupById(GetUserGroupById cmd)
        {
            return await Mediator.Send(cmd);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<UserGroupDto> GetSimpleUserGroupById(int id)
        {
            return await Mediator.Send(new GetSimpleUserGroupById { Id = id });
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<UserRole> GetRoleById(int id)
        {
            return await Mediator.Send(new GetRolesById { Id = id });
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<bool> AddGroupToUser(AddGroupToUserCommand cmd)
        {
            return await Mediator.Send(cmd);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<UserGroup>> GetUserinfo(string userId)
        {
            var cmd = new GetUserinfoCommand
            {
                UserId = userId
            };
            return await Mediator.Send(cmd);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<UserGroupNameDto>> GetUserGroupList()
        {
            return await Mediator.Send(new GetUserGroupListCommand());
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<UserGroupNameDto>> GetSimpleUserGroup(string userId)
        {
            return await Mediator.Send(new GetSimpleUserGroupCommand { UserId = userId });
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<LoggedUserInfo>> GetLoggedUserGroup()
        {
            return await Mediator.Send(new GetLoggedUserGroupCommand());
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<int> UpdateSimpleUserGroup(UpdateSimpleUserGroupCommand cmd)
        {
            return await Mediator.Send(cmd);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<UserInfomodel>> GetUserDetail()
        {
            return await Mediator.Send(new UserInfo());
        }
    }
}