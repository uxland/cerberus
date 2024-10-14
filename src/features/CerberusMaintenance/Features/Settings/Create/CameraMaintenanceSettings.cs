using Cerberus.Maintenance.Features.Features.Settings.Create;
using static Cerberus.Maintenance.Features.Features.Settings.Utilities;
namespace Cerberus.Maintenance.Features.Features.Settings;

public partial class CameraMaintenanceSettings
{
    public CameraMaintenanceSettings(CreateCameraSettings command)
    {
        var id = GetCameraSettingsId(command.CameraId);
        this.ApplyUncommittedEvent(new CameraSettingsCreated(id, new MaintenanceSettings(command.MaintenanceMode, command.AnalysisFiltersArgs)));
    }
    
    public void Apply(CameraSettingsCreated @event)
    {
        this.Id = @event.CameraId;
        Settings = @event.Settings;
    }
    
}