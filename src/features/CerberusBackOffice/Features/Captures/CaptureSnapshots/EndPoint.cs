using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace Cerberus.BackOffice.Features.Captures.CaptureSnapshots;

[ApiController]
[Route("api/[controller]")]
public class CapturesController(IMessageBus bus): ControllerBase
{
    [HttpPost("{locationId}")]
    public async Task<IActionResult> CaptureSnapshot(string locationId)
    {
        await bus.InvokeAsync(new CaptureLocationSnapshots(locationId));
        return Ok("Snapshot captured!");
    }
}