
using Cerberus.Maintenance.Features.Features.Settings;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks;

public interface IMaintenanceSettingsProvider
{
    Task<MaintenanceSettings> GetCameraMaintenanceSettings(string cameraId);
}