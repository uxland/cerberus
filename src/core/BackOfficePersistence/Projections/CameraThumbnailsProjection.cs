using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Cerberus.BackOffice.Features.Captures.GetCameraThumbnails;

namespace Cerberus.BackOffice.Persistence.Projections;

public class CameraThumbnailsProjection : Marten.Events.Projections.MultiStreamProjection<CameraThumbnails, string>
{
    public CameraThumbnailsProjection()
    {
        Identity<SnapshotCaptured>(x => x.Settings.CameraId);
        
    }
}