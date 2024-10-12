using Cerberus.Maintenance.Features.Features.Settings.Create;

namespace Cerberus.Maintenance.Features.Features.Settings;

public partial class CameraMaintenanceSettings
{
    public CameraMaintenanceSettings(CreateCameraSettings command)
    {
        this.ApplyUncommittedEvent(new CameraSettingsCreated(command.CameraId, new MaintenanceSettings(command.MaintenanceMode, command.AnalysisFiltersArgs)));
    }
    
    public void Apply(CameraSettingsCreated @event)
    {
        this.Id = @event.CameraId;
        Settings = @event.Settings;
    }
    
}