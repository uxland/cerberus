using Cerberus.BackOffice.Features.OrganizationalStructure.Location;
using Cerberus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;

public class Handler(IRepository<Camera> cameraRepository, IHierarchyItemPathProvider pathProvider, ILocationSettingsGetter locationSettingsGetter)
{
    public async Task<IEnumerable<object>> Handle(SetupCameraCommand request, CancellationToken cancellationToken)
    {
        var settings = await locationSettingsGetter.GetLocationSettings(request.ParentId);
        request = request with
        {
            AdminSettings = settings.AdminSettings.Merge(request.AdminSettings),
            FunctionalSettings = settings.FunctionalSettings.Merge(request.FunctionalSettings)
        };
        var path = await pathProvider.GetPathAsync(request);
        var camera = await cameraRepository.Rehydrate(request.Id);
        if (camera == null)
            camera = await CreateCamera(request, path);
        else
            await UpdateCamera(camera, request, path);
        return camera.GetUncommittedEvents();
    }

    private async Task<Camera> CreateCamera(SetupCameraCommand setupCamera, string path)
    {
        var camera = new Camera(setupCamera, path);
        await cameraRepository.Create(camera);
        return camera;
    }
    
    private Task UpdateCamera(Camera camera, SetupCameraCommand setupCamera, string path)
    {
        camera.Handle(setupCamera, path);
        return cameraRepository.Save(camera);
    }
}