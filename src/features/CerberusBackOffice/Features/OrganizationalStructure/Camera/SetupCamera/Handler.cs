using Cerberus.BackOffice.Features.OrganizationalStructure.Location;
using Cerberus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;

public class Handler(IRepository<OrganizationalStructure.Camera.Camera> cameraRepository, IHierarchyItemPathProvider pathProvider, ILocationSettingsGetter locationSettingsGetter)
{
    public async Task Handle(SetupCameraCommand request, CancellationToken cancellationToken)
    {
        var settings = await locationSettingsGetter.GetLocationSettings(request.ParentId);
        request = request with
        {
            AdminSettings = settings.AdminSettings.Merge(request.AdminSettings),
            FunctionalSettings = settings.FunctionalSettings.Merge(request.FunctionalSettings)
        };
        var path = await pathProvider.GetPathAsync(request);
        var camera = await cameraRepository.Rehydrate(request.Id);
        await (camera == null ? CreateCamera(request, path) : UpdateCamera(camera, request, path));
    }

    private Task CreateCamera(SetupCameraCommand setupCamera, string path)
    {
        var camera = new OrganizationalStructure.Camera.Camera(setupCamera, path);
        return cameraRepository.Create(camera);
    }
    
    private Task UpdateCamera(OrganizationalStructure.Camera.Camera camera, SetupCameraCommand setupCamera, string path)
    {
        camera.Handle(setupCamera, path);
        return cameraRepository.Save(camera);
    }
}