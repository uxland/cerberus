using Microsoft.AspNetCore.Mvc;

namespace Cerverus.BackOffice.Features.Captures.GetCameraThumbnails;

[ApiController]
[Route("api/[controller]")]
public class CamerasController(ICaptureQueryProvider captureQueryProvider): ControllerBase
{
    [HttpGet("{cameraId}/thumbnails")]
    public async Task<List<string>> GetCameraThumbnails(string cameraId)
    {
        var cameraThumbnails = await captureQueryProvider.GetCameraThumbnail(cameraId);
        return cameraThumbnails.Select(x => $"/images/{x}").ToList();
    }

}