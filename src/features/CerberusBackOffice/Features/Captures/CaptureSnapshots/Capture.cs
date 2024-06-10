using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.BackOffice.Features.Captures;

public partial class Capture:
    IDomainEventHandler<SnapshotCaptured>
{
    public Capture(CaptureSettings settings)
    {
        this.Id = Guid.NewGuid().ToString();
        this.ApplyUncommittedEvent(new SnapshotCaptured(settings));
    }

    public void Apply(SnapshotCaptured @event)
    {
        this.At = @event.Settings.At;
        this.SnapshotPath = @event.Settings.SnapshotPath;
        this.ThumbnailPath = @event.Settings.ThumbnailPath;
        this.CameraId = @event.Settings.CameraId;
        this.Error = @event.Settings.Error;
        this.CameraPath = @event.Settings.CameraPath;
    }
}

public record CaptureSettings(
    string CameraId,
    string CameraPath,
    Instant At,
    CaptureError? Error,
    string? SnapshotPath = null,
    string? ThumbnailPath = null
);