using Cerverus.Maintenance.Features.Features.MaintenanceChecks;
using Cerverus.Maintenance.Features.Features.Settings;

namespace Cerverus.Maintenance.Persistence.QueryProviders;

public class MaintenanceSettingsProvider: IMaintenanceSettingsProvider
{
    public Task<MaintenanceSettings> GetCameraMaintenanceSettings(string cameraId)
    {
        return Task.FromResult(
            new MaintenanceSettings(
                MaintenanceMode.Training,
                ["filter1", "filter2", "filter3"]
            )
        );
    }
}