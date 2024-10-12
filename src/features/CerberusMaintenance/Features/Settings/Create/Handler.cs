using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.Settings.Create;



public class Handler
{
    public static void Hande(CreateCameraSettings command, IGenericRepository repository)
    {
        var cameraMaintenanceSettings = new CameraMaintenanceSettings(command);
        repository.Create(cameraMaintenanceSettings);
    }
}