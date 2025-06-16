using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetMediaInfo;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera;

public partial class Camera
{
    public void UpdateMediaInfo(VideoStreamMediaInfo mediaInfo)
    {
        if(this.MediaInfo != mediaInfo)
            this.ApplyUncommittedEvent(new CameraMediaInfoChanged(this.Id, mediaInfo));
    }

    public void Apply(CameraMediaInfoChanged @event)
    {
        this.MediaInfo = @event.NewMediaInfo;
    }
}