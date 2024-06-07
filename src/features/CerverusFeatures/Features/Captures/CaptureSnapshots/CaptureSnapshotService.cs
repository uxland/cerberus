using Cerverus.Core.Domain;
using Cerverus.Features.Features.OrganizationalStructure.Camera;
using NodaTime;

namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

public class CaptureSnapshotService(IRepository<Capture> captureRepository, ISnapshotCapturer snapshotCapturer)
{
    public async Task<Capture> CaptureSnapshot(Camera camera)
    {
        var (error, rawPath, thumbnailPath, snapshotPath) = await snapshotCapturer.CaptureSnapshot(new CaptureSnapshotArguments(camera.AdminSettings!.IpAddress!, camera.AdminSettings!.Credentials!.Username, camera.AdminSettings!.Credentials.Password, camera.Path));
        var settings = new CaptureSettings(camera.Id, camera.Path, SystemClock.Instance.GetCurrentInstant(), error);
        if (error == null)
        {
            //var (snapshotPath, thumbnailPath) = SaveSnapshot(snapshot!, camera);
            settings = settings with
            {
                SnapshotPath = snapshotPath,
                ThumbnailPath = thumbnailPath
            };
        }

        var capture = new Capture(settings);
        await captureRepository.Create(capture);
        return capture;
    }
}