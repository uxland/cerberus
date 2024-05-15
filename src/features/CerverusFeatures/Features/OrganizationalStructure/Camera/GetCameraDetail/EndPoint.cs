using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerverus.Features.Features.OrganizationalStructure.Camera.GetCameraDetail;

[ApiController]
[Route("api/[controller]")]
public class CamerasController(ICameraQueryProvider queryProvider): ControllerBase
{
    [HttpGet("{cameraId}")]
    [
        ProducesResponseType(StatusCodes.Status200OK),
        ProducesResponseType(StatusCodes.Status404NotFound)
    ]
    public async Task<Camera?> GetCameraDetail(string cameraId)
    {
        var camera = await queryProvider.Rehydrate(cameraId);
        return camera;
    }
}