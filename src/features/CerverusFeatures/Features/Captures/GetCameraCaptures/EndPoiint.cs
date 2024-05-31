using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerverus.Features.Features.Captures.GetCameraCaptures;

[ApiController]
[Route("api/[controller]")]
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