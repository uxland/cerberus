using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems;
using Cerberus.BackOffice.Features.Shared;
using Wolverine;

namespace Cerberus.BackOffice.Features.Captures.CaptureSnapshots;

public static class CaptureSnapshotsHandler
{
    public static async Task<IEnumerable<CaptureCameraSnapshot>> Handle(CaptureCameraSnapshots command, ICameraEntityQueryProvider cameraEntityQueryProvider, IHierarchyItemEntityQueryProvider hierarchyItemEntityQueryProvider)
    {
        var location = await hierarchyItemEntityQueryProvider.RehydrateOrFail(command.LocationId);
        var cameras = await cameraEntityQueryProvider.GetCameraIdsByPath(location.Path);
        return cameras.Select(CaptureCameraSnapshot.Create);
    }
    
    public static async Task Handle(CaptureCameraSnapshot command, CaptureSnapshotService captureSnapshotService,  ICameraEntityQueryProvider cameraEntityQueryProvider, IMessageBus  outbox)
    {
        var camera = await cameraEntityQueryProvider.RehydrateOrFail(command.CameraId);
        var capture = await captureSnapshotService.CaptureSnapshot(camera);
        await outbox.PublishAsync(capture);
        
    }
}