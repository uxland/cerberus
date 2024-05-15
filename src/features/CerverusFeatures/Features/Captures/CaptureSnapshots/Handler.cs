using System.Drawing;
using System.Drawing.Imaging;
using Cerverus.Core.Domain;
using Cerverus.Features.Features.OrganizationalStructure.Camera;
using Cerverus.Features.Features.OrganizationalStructure.HierarchyItems;
using Cerverus.Features.Features.Shared;
using MediatR;
using NodaTime;

namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

public class Handler(ICameraQueryProvider cameraQueryProvider, IHierarchyItemQueryProvider hierarchyItemQueryProvider, ISnapshotCatcher snapshotCatcher, IPublisher publisher): 
    IRequestHandler<CaptureCameraSnapshots>,
    IRepositoryHandlerMixin<HierarchyItem>
{
    public async Task Handle(CaptureCameraSnapshots request, CancellationToken cancellationToken)
    {
        var location = await this.Rehydrate(request.LocationId);
        var cameras = await cameraQueryProvider.GetCamerasByPath(location.Path);
        await Task.WhenAll(cameras.Select(CaptureSnapshot));
    }
    
    private async Task CaptureSnapshot(Camera camera)
    {
        var snapshot = await snapshotCatcher.CaptureSnapshot(new CaptureSnapshotArguments(camera.AdminSettings!.IpAddress!, camera.AdminSettings!.Credentials!.Username, camera.AdminSettings!.Credentials.Password));
        var (buffer, error) = snapshot;
        
        var task = error != null ? HandleCaptureError(camera, error) :  HandleCaptureSuccess(camera, buffer!);
        await task;

    }
    
    private async Task HandleCaptureError(Camera camera, CaptureError error)
    {
        await publisher.Publish(new SnapshotCaptured(camera.Id, error, null));
    }

    private async Task HandleCaptureSuccess(Camera camera, byte[] buffer)
    {
        var snapshotPath = await SaveSnapshot(buffer, camera);
        await publisher.Publish(new SnapshotCaptured(camera.Id, null, snapshotPath));
    }
    private static async Task<string> SaveSnapshot(byte[] buffer, Camera camera)
    {
        var pathSegments = camera.Path.Split(">");
        var path = Path.Combine(pathSegments);
        var fileName = $"{Instant.FromDateTimeUtc(DateTime.UtcNow):yyyyMMddHHmmss}";
        var fullPath = Path.Combine(path, fileName);
        var bitmap = new Bitmap(new MemoryStream(buffer));
        bitmap.Save($"{fullPath}.bmp", ImageFormat.Bmp);
        var thumbnail = bitmap.GetThumbnailImage(100, 100, null, IntPtr.Zero);
        thumbnail.Save($"{fullPath}.thumbnail.png", ImageFormat.Png);
        return fullPath;
    }
    
    public IRepositoryBase<HierarchyItem> Repository => hierarchyItemQueryProvider;
}