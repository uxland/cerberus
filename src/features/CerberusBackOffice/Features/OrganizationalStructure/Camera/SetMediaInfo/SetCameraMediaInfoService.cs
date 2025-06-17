namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetMediaInfo;

public class SetCameraMediaInfoService(ICameraSettingsProvider settingsProvider)
{
    public async Task SetCameraMediaInfo(Camera camera)
    {
        var settings = await this.GetCameraInfo(camera);
        camera.UpdateMediaInfo(settings);
    }

    private Task<VideoStreamMediaInfo> GetCameraInfo(Camera camera)
    {
        return settingsProvider.GetCameraSettings(new CameraConnectionSettings(
            camera.AdminSettings.IpAddress!,
            camera.AdminSettings.Credentials!.Username,
            camera.AdminSettings.Credentials.Password));
    }
}