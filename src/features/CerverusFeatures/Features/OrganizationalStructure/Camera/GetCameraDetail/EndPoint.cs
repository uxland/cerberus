using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerverus.Features.Features.OrganizationalStructure.Camera.GetCameraDetail;

[ApiController]
[Route("api/[controller]")]
public class CamerasController(ICameraQueryProvider queryProvider): ControllerBase
{
    public const string ProducesMediaType = "application/json;domain-model=Cerverus.BackOffice.CameraDetail;version1.0.0";
    
    [HttpGet("{cameraId}")]
    [
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Camera)),
        ProducesResponseType(StatusCodes.Status404NotFound),
        Produces(ProducesMediaType)
    ]
    public async Task<IActionResult> GetCameraDetail(string cameraId)
    {
        var camera = await queryProvider.Rehydrate(cameraId);
        return camera == null ? NotFound() : Ok(camera);
    }
}