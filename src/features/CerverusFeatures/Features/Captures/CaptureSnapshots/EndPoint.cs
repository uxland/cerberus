using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

[ApiController]
[Route("api/[controller]")]
public class CapturesController(IMessageBus bus): ControllerBase
{
    [HttpPost("{locationId}")]
    public async Task<IActionResult> CaptureSnapshot(string locationId)
    {
        await bus.InvokeAsync(new CaptureCameraSnapshots(locationId));
        return Ok("Snapshot captured!");
    }
}