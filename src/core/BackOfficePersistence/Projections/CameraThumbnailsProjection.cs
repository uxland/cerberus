using Cerverus.BackOffice.Features.Captures.CaptureSnapshots;
using Cerverus.BackOffice.Features.Captures.GetCameraThumbnails;

namespace Cerverus.BackOffice.Persistence.Projections;

public class CameraThumbnailsProjection : Marten.Events.Projections.MultiStreamProjection<CameraThumbnails, string>
{
    public CameraThumbnailsProjection()
    {
        Identity<SnapshotCaptured>(x => x.Settings.CameraId);
        
    }
}