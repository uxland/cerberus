using Cerberus.Maintenance.Features.Features.MaintenanceChecks;
using Cerberus.Maintenance.Features.Features.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Cerberus.Maintenance.Features.Features.Settings.Constants;
namespace Cerberus.Maintenance.Features.Features.Settings.GetMaintenanceSettings;

[ApiController]
[Route(ApiRootRoute)]
public class EndPoint: ControllerBase
{
    [HttpGet("{id}")]
    [Authorize(Roles = MaintenanceRoles.Consultant)]
    [ProducesResponseType<CameraMaintenanceSettings>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMaintenanceSettings(string id, IMaintenanceSettingsProvider provider)
    {
        var result = await provider.GetCameraMaintenanceSettings(id);
        return result is null ? NotFound() : Ok(result);
    }
}