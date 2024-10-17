using Cerberus.Maintenance.Features.Features.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wolverine;
using static Cerberus.Maintenance.Features.Features.Settings.Constants;
namespace Cerberus.Maintenance.Features.Features.Settings.GetMaintenanceSettings;

[ApiController]
[Route(ApiRootRoute)]
public class EndPoint: ControllerBase
{
    [HttpGet("{id}")]
    [Authorize(Roles = MaintenanceRoles.Consultant)]
    [ProducesResponseType<MaintenanceSettingsDetail>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMaintenanceSettings(string id, IMessageBus bus)
    {
        var result = await bus.InvokeAsync<MaintenanceSettingsDetail>(new GetMaintenanceSettings(id));
        return result is null ? NotFound() : Ok(result);
    }
}