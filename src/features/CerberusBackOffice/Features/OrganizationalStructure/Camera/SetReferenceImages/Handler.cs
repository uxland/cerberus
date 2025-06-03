using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetReferenceImages;

public class Handler(IGenericRepository cameraRepository, SetCameraReferenceImagesService service)
{
    public Task Handle(CameraCreated cameraCreated)
    {
        return this.SetCameraReferenceImages(cameraCreated.CameraId);
    }

    public Task Handle(CameraUpdated cameraUpdated)
    {
        return this.SetCameraReferenceImages(cameraUpdated.CameraId);
    }

    private async Task SetCameraReferenceImages(string cameraId)
    {
        var camera = await cameraRepository.RehydrateOrThrow<Camera>(cameraId);
        await service.SetCameraReferenceImages(camera);
        cameraRepository.Save(camera);
    }
}