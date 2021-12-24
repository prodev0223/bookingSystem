using System.Collections.Generic;
using System.Security;
using System.Threading.Tasks;
using booking.Application.TodoItems.Commands.DeleteTodoItem;
using booking.Application.UserPermissions.Commands.CreatePermissionSet;
using booking.Application.UserPermissions.Commands.DeletePermissionSet;
using booking.Application.UserPermissions.Commands.UpdatePermissionSet;
using booking.Application.UserPermissions.Queries;
using booking.Application.UserPermissions.Queries.GetPermissionNameList;
using booking.Application.UserPermissions.Queries;
using booking.Application.Users.Queries.GetUsers;
using booking.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PermissionSet = booking.Domain.Entities.PermissionSet;

namespace booking.WebUI.Controllers
{
    [Authorize]
    public class UserPermissionController : ApiControllerBase
    {
        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<UserPermissionDto>> GetPermissionNameList()
        {
            GetPermissionListQuery query = new();

            return await Mediator.Send(query);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<int> CreatePermissionSet(CreatePermissionSetCommand cmd)
        {
            return await Mediator.Send(cmd);
        }
        
        [HttpPost]
        [Route("[action]")]
        public async Task<bool> DeletePermissionSet(DeletePermissionSetCommand cmd)
        {
            return await Mediator.Send(cmd);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<bool> DeletePermissionSets(List<int> ids)
        {
            bool status = true;

            if (ids != null && ids.Count > 0)
            {
                foreach (int delId in ids)
                {
                    await Mediator.Send(new DeletePermissionSetCommand() { Id = delId });
                }
            }

            return status;
        }


        [HttpPost]
        [Route("[action]")]
        public async Task<int> UpdatePermissionSet(UpdatePermissionSetCommand cmd)
        {
            return await Mediator.Send(cmd);
        }

        
        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<PermissionSet>> GetPermissionSetList()
        {
            GetAllPermissionSetList query = new();
            return await Mediator.Send(query);
        }
        
        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<PermissionSet>> GetMySystemPermission()
        {
            return await Mediator.Send(new GetMySystemPermissionQuery());
        }
        
        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<UserGroup>> GetMyRoomsPermission()
        {
            return await Mediator.Send(new GetMyRoomsPermissionQuery());
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<PermissionSet> GetOnePermissionSetQuery(int setId)
        {
            return await Mediator.Send(new GetPermissionSetQueries
            {
                Id = setId
            });
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<PermissionSetDto>?> GetPermissionSetNameList()
        {
            IEnumerable<PermissionSetDto>? res = await Mediator.Send(new GetPermissionSetNameListCommand());
            return res;
        }
        
    }
}