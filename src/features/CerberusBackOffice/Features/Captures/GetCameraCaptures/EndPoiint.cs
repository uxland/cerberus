using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerberus.BackOffice.Features.Captures.GetCameraCaptures;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CamerasController(ICaptureQueryProvider captureQueryProvider): ControllerBase
{
    [
        HttpGet("{cameraId}/captures"),
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<Capture>)),
        ProducesResponseType(StatusCodes.Status404NotFound),
    ]
    public async Task<IActionResult> GetCameraThumbnails(string cameraId)
    {
       var result = await captureQueryProvider.GetCameraCaptures(cameraId);
       return string.IsNullOrEmpty(result) ? NotFound() : Ok(result);
    }

}