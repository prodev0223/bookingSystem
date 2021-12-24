using booking.Application.AuditLog.Queries.Audit;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using booking.Application.AuditLog.Commands;

namespace booking.WebUI.Controllers
{
    [Authorize]
    public class AuditController : ApiControllerBase
    {
        [HttpGet]
        [Route("[action]")]
        public async Task<IEnumerable<AuditlogModel>> GetAuditInfo()
        {
            return await Mediator.Send(new Audit());
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<int> addauditlog(AddAuditlog cmd)
        {
            int res = await Mediator.Send(cmd);
            return res;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<int> Updateaddauditlog(UpdateAuditlogcomand cmd)
        {
            return await Mediator.Send(cmd);
        }
    }
}
