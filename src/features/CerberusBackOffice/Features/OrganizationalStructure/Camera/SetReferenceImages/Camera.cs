using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetReferenceImages;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera;

public partial class Camera
{
    public void UpdateReferenceImages(string cameraImageUrl, string cameraImageThumbnailUrl)
    {
        this.ApplyUncommittedEvent(new CameraReferenceImagesChanged(this.Id, cameraImageUrl, cameraImageThumbnailUrl));
    }
    
    public void Apply(CameraReferenceImagesChanged @event)
    {
        this.CameraImageUrl = @event.CameraImageUrl;
        this.CameraImageThumbnailUrl = @event.CameraImageThumbnailUrl;
    }
}