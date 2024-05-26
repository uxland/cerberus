using Cerverus.Features.Features.OrganizationalStructure.Camera;
using Cerverus.Features.Features.OrganizationalStructure.HierarchyItems;
using Cerverus.Features.Features.Shared;
using Wolverine;


namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

public static class CaptureSnapshotsHandler
{
    public static async Task<IEnumerable<CaptureCameraSnapshot>> Handle(CaptureCameraSnapshots command, ICameraQueryProvider cameraQueryProvider, IHierarchyItemQueryProvider hierarchyItemQueryProvider)
    {
        var location = await hierarchyItemQueryProvider.RehydrateOrFail(command.LocationId);
        var cameras = await cameraQueryProvider.GetCameraIdsByPath(location.Path);
        return cameras.Select(CaptureCameraSnapshot.Create);
    }
    
    public static async Task Handle(CaptureCameraSnapshot command, CaptureSnapshotService captureSnapshotService,  ICameraQueryProvider cameraQueryProvider, IMessageBus  outbox)
    {
        var camera = await cameraQueryProvider.RehydrateOrFail(command.CameraId);
        var capture = await captureSnapshotService.CaptureSnapshot(camera);
        await outbox.PublishAsync(capture);
        
    }
}