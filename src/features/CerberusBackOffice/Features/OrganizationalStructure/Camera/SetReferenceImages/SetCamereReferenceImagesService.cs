using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetReferenceImages;

public class SetCameraReferenceImagesService(ISnapshotCapturer snapshotCapturer)
{
    private const string RootPath = "OrganizationalStructure/Cameras";

    public async Task SetCameraReferenceImages(Camera camera)
    {
        var (imageUrl, thumbnailUrl) = await GetCameraImageUrls(camera);
        camera.UpdateReferenceImages(imageUrl, thumbnailUrl);
    }
    private async Task<(string ImageUrl, string ThumbnailUrl)> GetCameraImageUrls(Camera camera)
    {
        var imageUrl = Path.Combine(RootPath,  camera.Id, "image.jpg");
        var thumbnailUrl = Path.Combine(RootPath, camera.Id, "thumbnail.jpg");
        
        await snapshotCapturer.CaptureSnapshot(new CaptureSnapshotArguments(
            camera.AdminSettings.IpAddress!,
            camera.AdminSettings.Credentials!.Username,
            camera.AdminSettings.Credentials.Password,
            Path.Combine(RootPath, camera.Id),
            ThumbnailPath:thumbnailUrl,
            RawPath:imageUrl,
            Monochrome:false
        ));
        
        return (imageUrl, thumbnailUrl);
    }
}