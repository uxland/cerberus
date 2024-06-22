using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks.ProduceCaptureFailureMaintenanceCheck;

public static class ProduceCaptureFailureHandler
{
    public static void Handle(CreateFailureMaintenanceCheck command, IGenericRepository repository)
    {
        var maintenanceCheck = new MaintenanceCheck(command);
        repository.Create(maintenanceCheck);
    }
}