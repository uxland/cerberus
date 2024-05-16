
using Cerverus.Features.Features.Captures.CaptureSnapshots;
using Cerverus.Features.Features.Captures.GetCameraThumbnails;

namespace Cerverus.BackOffice.Persistence.Projections;

public class CameraThumbnailsProjection : Marten.Events.Projections.MultiStreamProjection<CameraThumbnails, string>
{
    public CameraThumbnailsProjection()
    {
        Identity<SnapshotCaptured>(x => x.Settings.CameraId);
    }
}