using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.MaintenanceChecks.ProduceCaptureFailureMaintenanceCheck;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks;

public static class ProduceMaintenanceCheckHandler
{
    public static void Handle(CreateFailureMaintenanceCheck command, IGenericRepository repository)
    {
        var maintenanceCheck = new MaintenanceCheck(command);
        repository.Create(maintenanceCheck);
    }
}