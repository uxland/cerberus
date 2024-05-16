using Microsoft.AspNetCore.Mvc;

namespace Cerverus.Features.Features.Captures.GetCameraCaptures;

[ApiController]
[Route("api/[controller]")]
public class CamerasController(ICaptureQueryProvider captureQueryProvider): ControllerBase
{
    [HttpGet("{cameraId}/captures")]
    public async Task<List<Capture>> GetCameraThumbnails(string cameraId)
    {
        var captures = await captureQueryProvider.GetCameraCaptures(cameraId);
        return captures;
    }

}