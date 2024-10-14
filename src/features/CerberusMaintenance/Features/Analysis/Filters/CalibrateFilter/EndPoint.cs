using System.Text.Json;
using Cerberus.Maintenance.Features.Features.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Wolverine;

namespace Cerberus.Maintenance.Features.Features.Analysis.Filters.CalibrateFilter;

[ApiController]
[Route("api/filters")]
public class EndPoint(IMessageBus bus, ILogger<EndPoint> logger): ControllerBase
{
    [HttpPut("{id}:calibrate")]
    [Authorize(Roles = MaintenanceRoles.Consultant)]
    [Produces<CalibrateResult>]
    public async Task<IActionResult> CalibreateCamera(string id, [FromBody] CalibrateCameraFilter command)
    {
        var cmd = command with
        {
            FilterId = id
        };
        try
        {
            var result = await bus.InvokeAsync<IList<CalibrateResult>>(cmd);
            return Ok(result);
        }
        catch (Exception e)
        {
            var args = JsonSerializer.Serialize(cmd.Args);
            LoggerExtensions.LogError(logger,  "Error calibrating filter {FilterId} for camera {CameraId} and args: {Args}", cmd.FilterId, cmd.CameraId, args);
            throw;
        }
        
    }
}