using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.MaintenanceChecks;
using Cerberus.Maintenance.Features.Features.Settings.Create;

namespace Cerberus.Maintenance.Features.Features.Settings.SetFilterArgs;

public static class Handler
{
    public  static async Task Handle(SetCameraFilterArgs command, IGenericRepository repository, IMaintenanceSettingsProvider settingsProvider)
    {
        
        var maintenanceSettings = await GetSettings(command, repository, settingsProvider);
        maintenanceSettings.SetFilterArgs(command);
        var exists = await repository.Exists<CameraMaintenanceSettings>(Utilities.GetCameraSettingsId(command.CameraId));
        if (exists) repository.Save(maintenanceSettings);
        else repository.Create(maintenanceSettings);

    }
    private static async Task<CameraMaintenanceSettings> GetSettings(SetCameraFilterArgs command, IGenericRepository repository, IMaintenanceSettingsProvider settingsProvider)
    {
        var (cameraId, filterId, _) = command;
        var current = await repository.Rehydrate<CameraMaintenanceSettings>(Utilities.GetCameraSettingsId(cameraId));
        if (current == null)
        {
            var settings = await settingsProvider.GetCameraMaintenanceSettings(cameraId);
            current = new CameraMaintenanceSettings(new CreateCameraSettings(command.CameraId, settings.MaintenanceMode, settings.AnalysisFiltersArgs));
        }
        return current;
    }
}