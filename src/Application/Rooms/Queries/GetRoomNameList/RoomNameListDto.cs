using System;
using System.Collections;
using System.Collections.Generic;
using AutoMapper;
using booking.Application.Common.Mappings;
using booking.Application.TodoLists.Queries.GetTodos;
using booking.Domain.Entities;

namespace booking.Application.Rooms.Queries.GetRoomNameList
{
    public class RoomNameListDto : IMapFrom<Room>
    {
        public IEnumerable<RoomExtraInfoField> RoomExtraInfoFields { get; set; }
        public int Id { get; set; }

        public string IdCode { get; set; }

        public string Name { get; set; }

        public string ShortName { get; set; }

        public string ChineseName { get; set; }

        public string MappingKey { get; set; }

        public DateTime Start { get; set; }

        public DateTime End { get; set; }
    }
}