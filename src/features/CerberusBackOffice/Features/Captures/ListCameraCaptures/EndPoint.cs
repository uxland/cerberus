using Cerberus.BackOffice.Features.Captures.ListCameraCaptures;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace Cerberus.BackOffice.Features.Captures.GetCameraCaptures;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CamerasController(IMessageBus bus): ControllerBase
{
    [
        HttpGet("{cameraId}/captures"),
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<Capture>)),
        ProducesResponseType(StatusCodes.Status404NotFound),
    ]
    public async Task<IActionResult> GetCameraThumbnails(string cameraId)
    {
        var query = new ListCameraCapturesAsJson(cameraId);
        var result = await bus.InvokeAsync<string>(query);
       return string.IsNullOrEmpty(result) ? NotFound() : Ok(result);
    }

}