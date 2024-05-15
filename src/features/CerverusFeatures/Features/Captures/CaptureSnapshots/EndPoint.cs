using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

[ApiController]
[Route("api/[controller]")]
public class CapturesController(ISender mediator): ControllerBase
{
    [HttpPost("{locationId}")]
    public async Task<IActionResult> CaptureSnapshot(string locationId)
    {
        await mediator.Send(new CaptureCameraSnapshots(locationId));
        return Ok("Snapshot captured!");
    }
}