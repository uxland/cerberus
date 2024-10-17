using Cerberus.BackOffice.Features.Captures.Specs;
using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Mvc;

namespace Cerberus.BackOffice.Features.Captures.GetCameraThumbnails;

[ApiController]
[Route("api/[controller]")]
public class CamerasController(IReadModelQueryProvider captureQueryProvider): ControllerBase
{
    [HttpGet("{cameraId}/thumbnails")]
    public async Task<List<string>> GetCameraThumbnails(string cameraId)
    {
        var filter = CaptureSpecs.SuccessfulByCamera(cameraId);
        var cameraThumbnails = await captureQueryProvider.ProjectList<Capture, string?>(x => x.ThumbnailPath, filter);
        return cameraThumbnails.Select(x => $"/images/{x}").ToList();
    }
}