namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetMediaInfo;

public interface ICameraSettingsProvider
{
    Task<VideoStreamMediaInfo> GetCameraSettings(CameraConnectionSettings connectionSettings, CancellationToken cancellationToken = default);
}