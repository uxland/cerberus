using Cerberus.Maintenance.Features.Features.Settings.SetFilterArgs;

namespace Cerberus.Maintenance.Features.Features.Settings;

public partial class CameraMaintenanceSettings
{
    public void SetFilterArgs(SetCameraFilterArgs command)
    {
        this.ApplyUncommittedEvent(new CameraFilterArgsSet(Utilities.GetCameraSettingsId(command.CameraId), command.FilterId, command.Args));
    }

    public void Apply(CameraFilterArgsSet @event)
    {
        this.Settings = this.Settings with
        {
            AnalysisFiltersArgs = new Dictionary<string, dynamic?>(this.Settings.AnalysisFiltersArgs)
            {
                [@event.FilterId] = @event.Args
            }
        };
    }
}