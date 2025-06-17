using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;
using Cerberus.Core.Domain;
using Microsoft.Extensions.Logging;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetMediaInfo;

public class Handler(IGenericRepository genericRepository, SetCameraMediaInfoService service, ILogger<Handler> logger)
{
    public Task Handle(CameraCreated cameraCreated)
    {
        return this.SetCameraMediaInfo(cameraCreated.CameraId);
    }

    public Task Handle(CameraUpdated cameraUpdated)
    {
        return this.SetCameraMediaInfo(cameraUpdated.CameraId);
    }

    private async Task SetCameraMediaInfo(string cameraId)
    {
        try
        {
            var camera = await genericRepository.RehydrateOrThrow<Camera>(cameraId);
            await service.SetCameraMediaInfo(camera);
            genericRepository.Save(camera);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to set camera media info CameraId:{CameraId}. Error: {Error}", cameraId, e.Message);
        }
    }
}