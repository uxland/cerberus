namespace Cerberus.Maintenance.Features.Features.Settings;

public static class Constants
{
    public const string ApiRootRoute = "api/camera-maintenance-settings";
    public const string CameraSettingsIdPrefix = "camera-settings-";
}

public static class Utilities
{
    public static string GetCameraSettingsId(string cameraId) => $"{Constants.CameraSettingsIdPrefix}{cameraId}";
}