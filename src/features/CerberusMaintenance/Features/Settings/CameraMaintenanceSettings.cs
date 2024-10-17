using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.Settings;

public partial class CameraMaintenanceSettings: AggregateRoot
{
   public MaintenanceSettings Settings { get; set; }

    public CameraMaintenanceSettings()
    {
    }
}