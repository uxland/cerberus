using Cerverus.Core.Domain;
using Cerverus.Features.Features.OrganizationalStructure.Camera;
using Cerverus.Features.Features.OrganizationalStructure.HierarchyItems;
using Cerverus.Features.Features.Shared;
using MediatR;

namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

internal class Handler(ICameraQueryProvider cameraQueryProvider, IHierarchyItemQueryProvider hierarchyItemQueryProvider, CaptureSnapshotService captureSnapshotService): 
    IRequestHandler<CaptureCameraSnapshots>,
    IRepositoryHandlerMixin<HierarchyItem>
{
    public async Task Handle(CaptureCameraSnapshots request, CancellationToken cancellationToken)
    {
        var location = await this.Rehydrate(request.LocationId);
        var cameras = await cameraQueryProvider.GetCamerasByPath(location.Path);
        await Task.WhenAll(cameras.Select(captureSnapshotService.CaptureSnapshot));
    }
    public IRepositoryBase<HierarchyItem> Repository => hierarchyItemQueryProvider;
}