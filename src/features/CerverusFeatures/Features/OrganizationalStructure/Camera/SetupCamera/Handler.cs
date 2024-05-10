using Cerverus.Core.Domain;
using Cerverus.Features.Features.OrganizationalStructure.Location;
using Cerverus.Features.Features.OrganizationalStructure.Shared;
using MediatR;

namespace Cerverus.Features.Features.OrganizationalStructure.Camera.SetupCamera;

internal class Handler(IRepository<Camera> cameraRepository, IHierarchyItemPathProvider pathProvider, ILocationSettingsGetter locationSettingsGetter):
    IRequestHandler<SetupCameraCommand>
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
        var camera = new Camera(setupCamera, path);
        return cameraRepository.Create(camera);
    }
    
    private Task UpdateCamera(Camera camera, SetupCameraCommand setupCamera, string path)
    {
        camera.Handle(setupCamera, path);
        return cameraRepository.Save(camera);
    }
}