using Cerberus.Maintenance.Features.Features.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;
using static Cerberus.Maintenance.Features.Features.Settings.Constants;
namespace Cerberus.Maintenance.Features.Features.Settings.SetFilterArgs;

[ApiController]
[Route(ApiRootRoute)]
public class EndPoint: ControllerBase
{
    [HttpPut("{id}/filter-args/{filterId}")]
    [Authorize(Roles = MaintenanceRoles.Consultant)]
    public async Task<IActionResult> SetFilterArgs(string id, string filterId, [FromBody]dynamic? args, IMessageBus bus)
    {
        await bus.SendAsync(new SetCameraFilterArgs(id, filterId, args));
        return Ok("Filter args set.");
    }
}