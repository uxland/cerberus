using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.BackOffice.Features.Captures.CaptureSnapshots;

public class CaptureSnapshotService(IRepository<Captures.Capture> captureRepository, ISnapshotCapturer snapshotCapturer)
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

        var capture = new Captures.Capture(settings);
        captureRepository.Create(capture);
        return capture;
    }
}