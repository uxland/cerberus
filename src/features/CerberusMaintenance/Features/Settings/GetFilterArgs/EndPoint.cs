using Cerberus.Maintenance.Features.Features.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wolverine;
using static Cerberus.Maintenance.Features.Features.Settings.Constants;

namespace Cerberus.Maintenance.Features.Features.Settings.GetCameraFilterParameters;

[ApiController]
[Route(ApiRootRoute)]
public class EndPoint: ControllerBase
{
    [HttpGet("{id}/filters/{filterId}")]
    [Authorize(Roles = MaintenanceRoles.Consultant)]
    [ProducesResponseType<CameraFilterParameters>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCameraFilterParameters(string id, string filterId, IMessageBus bus)
    {
        var result = await bus.InvokeAsync<CameraFilterParameters>(new GetCameraFilterParameters(id, filterId));
        return result is null ? NotFound() : Ok(result);
    }
}