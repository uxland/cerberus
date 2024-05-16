using Cerverus.Core.Domain;
using Cerverus.Features.Features.Shared;
using Microsoft.AspNetCore.Mvc;

namespace Cerverus.Features.Features.Captures.GetCameraThumbnails;

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