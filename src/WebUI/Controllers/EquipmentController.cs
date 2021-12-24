using System.Collections.Generic;
using System.Threading.Tasks;
using booking.Application.Equipments.Command.CreateEquipment;
using booking.Application.Equipments.Command.DeleteEquipment;
using booking.Application.Equipments.Command.UpdateEquipment;
using booking.Application.Equipments.Query.GetEquipmentNameList;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace booking.WebUI.Controllers
{
    [Authorize]
    public class EquipmentController : ApiControllerBase
    {
        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<EquipmentNameDtos>> GetNameList()
        {
            GetEquipmentNamesQuery cmd = new();

            var res = await Mediator.Send(cmd);

            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<int>> AddEquipment(CreateEquipmentCommand cmd)
        {
            var res = await Mediator.Send(cmd);

            return res;
        }

        [HttpDelete]
        [Route("[action]")]
        public async Task<ActionResult<int>> RemoveEquipment(DeleteEquipmentCommand cmd)
        {
            var res = await Mediator.Send(cmd);

            return res;
        }

        [HttpPut]
        [Route("[action]")]
        public async Task<ActionResult<int>> UpdateEquipment(UpdateEquipmentCommand cmd)
        {
            var res = await Mediator.Send(cmd);

            return res;
        }
    }
}