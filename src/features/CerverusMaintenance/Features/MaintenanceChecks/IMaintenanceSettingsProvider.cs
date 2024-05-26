
using Cerverus.Maintenance.Features.Features.Settings;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

public interface IMaintenanceSettingsProvider
{
    Task<MaintenanceSettings> GetCameraMaintenanceSettings(string cameraId);
}