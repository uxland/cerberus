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
        var exists = await repository.Exists<CameraMaintenanceSettings>(command.CameraId);
        if (exists) repository.Save(maintenanceSettings);
        else repository.Create(maintenanceSettings);

    }
    private static async Task<CameraMaintenanceSettings> GetSettings(SetCameraFilterArgs command, IGenericRepository repository, IMaintenanceSettingsProvider settingsProvider)
    {
        var current = await repository.Rehydrate<CameraMaintenanceSettings>(command.CameraId);
        if (current == null)
        {
            var settings = await settingsProvider.GetCameraMaintenanceSettings(command.CameraId);
            current = new CameraMaintenanceSettings(new CreateCameraSettings(command.CameraId, settings.MaintenanceMode, settings.AnalysisFiltersArgs));
        }
        return current;
    }
}