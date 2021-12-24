using System.Collections.Generic;
using System.Threading.Tasks;
using booking.Application.Rooms.Commands;
using booking.Application.Rooms.Commands.CreateRooms;
using booking.Application.Rooms.Commands.DeleteRoom;
using booking.Application.Rooms.Commands.UpdateRoom;
using booking.Application.Rooms.Queries;
using booking.Application.Rooms.Queries.GetMyRoomList;
using booking.Application.Rooms.Queries.GetOneRoom;
using booking.Application.Rooms.Queries.GetRoomNamelist;
using booking.Application.Rooms.Queries.GetRoomNameList;
using booking.Application.RoomSets.Commands.CreateRoomSet;
using booking.Application.RoomSets.Commands.DeleteRoomSet;
using booking.Application.RoomSets.Commands.UpdateRoomSet;
using booking.Application.RoomSets.Queries;
using booking.Application.RoomSets.Queries.GetAllRoomSet;
using booking.Application.RoomSets.Queries.GetOneRoomSet;
using booking.Domain.Entities;
using MediatR;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RoomSetDto = booking.Application.RoomSets.Queries.GetOneRoomSet.RoomSetDto;

namespace booking.WebUI.Controllers
{
    [Authorize]
    public class RoomController : ApiControllerBase
    {
        //public class GetOneRoomQuery : IRequest<CreateUpdateRoomDto>
        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<RoomNameListDto>> GetFullList()
        {
            GetRoomNameListQuery query = new();
            var res = await Mediator.Send(query);
            return res;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<CreateUpdateRoomDto> GetOne(int id)
        {
            GetOneRoomQuery query = new() { RoomId = id };
            var res = await Mediator.Send(query);
            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<int> CreateRoom(CreateRoomCommand cmd)
        {
            int res = await Mediator.Send(cmd);
            return res;
        }

        [HttpDelete]
        [Route("[action]")]
        public async Task<Unit> DeleteRoom(int id)
        {
            DeleteRoomCommand query = new() { Id = id };
            Unit res = await Mediator.Send(query);
            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<Unit> DeleteRooms(List<int> ids)
        {
            Unit res = default;

            if (ids != null && ids.Count > 0)
            {
                foreach (int roomId in ids)
                {
                    DeleteRoomCommand query = new() { Id = roomId };
                    res = await Mediator.Send(query);
                }
            }

            return res;
        }

        [HttpPut]
        [Route("[action]")]
        public async Task<int> UpdateRoom(UpdateRoomCommand query)
        {
            int res = await Mediator.Send(query);
            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<int> CreateUpdateRoom(CreateUpdateRoomDto query)
        {
            int res;
            if (query.RoomId != 0)
            {
                UpdateRoomCommand upda = new()
                {
                    RoomId = query.RoomId,
                    Name = query.Name,
                    ShortName = query.ShortName,
                    ChineseName = query.ChineseName,
                    MappingKey = query.MappingKey,
                    Start = query.Start,
                    End = query.End,
                    TimeSpanMinutes = query.TimeSpanMinutes,
                    BookingUserModeId = query.BookingUserModeId,
                    AutoRelease = query.AutoRelease,
                    Disabled = query.Disabled,
                    DefaultBookingTypeId = query.DefaultBookingTypeId,
                    InAdvanceDay = query.InAdvanceDay,
                };
                res = await Mediator.Send(upda);
            }
            else
            {
                CreateRoomCommand upda = new()
                {
                    RoomId = query.RoomId,
                    Name = query.Name,
                    ShortName = query.ShortName,
                    ChineseName = query.ChineseName,
                    MappingKey = query.MappingKey,
                    Start = query.Start,
                    End = query.End,
                    TimeSpanMinutes = query.TimeSpanMinutes,
                    BookingUserModeId = query.BookingUserModeId,
                    AutoRelease = query.AutoRelease,
                    Disabled = query.Disabled,
                    DefaultBookingTypeId = query.DefaultBookingTypeId,
                    InAdvanceDay = query.InAdvanceDay,
                    RoomExtraInfoFields = query.RoomExtraInfoFields.ToList()
                };
                res = await Mediator.Send(upda);
            }

            return res;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<RoomNameListDto>> GetMyList()
        {
            GetMyRoomListQueries query = new();
            var res = await Mediator.Send(query);
            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<int> CreateRoomSet(CreateRoomSetCommand cmd)
        {
            return await Mediator.Send(cmd);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<int> UpdateRoomSet(UpdateRoomSetCommand cmd)
        {
            return await Mediator.Send(cmd);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<bool> DeleteRoomSet(DeleteRoomSetCommand cmd)
        {
            return await Mediator.Send(cmd);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<bool> DeleteRoomSets(List<int> ids)
        {
            bool status = true;

            if (ids != null && ids.Count > 0)
            {
                foreach (int delId in ids)
                {
                    await Mediator.Send(new DeleteRoomSetCommand() { Id = delId });
                }
            }

            return status;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IEnumerable<RoomSet>> GetAllRoomSet(GetAllRoomSets cmd)
        {
            IEnumerable<RoomSet> res = await Mediator.Send(cmd);
            return res;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<RoomSetDto> GetOneRoomSet(int setId)
        {
            RoomSetDto res = await Mediator.Send(new GetOneRoomSetQuery { SetID = setId });
            return res;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<RoomSetSimpleDto>> GetRoomSetSimple()
        {
            var res = await Mediator.Send(new GetRoomSetSimpleCommand());
            return res;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<RoomExtraInfoTemplate>> GetRoomExtraFields()
        {
            var res = await Mediator.Send(new GetRoomExtraFieldsQuery());
            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<bool> UpdateRoomExtraFields(UpdateRoomExtraFieldsCommand cmd)
        {
            var res = await Mediator.Send(cmd);
            return res;
        }
    }
}