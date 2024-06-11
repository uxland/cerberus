using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.MaintenanceChecks.ProduceCaptureFailureMaintenanceCheck;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks;

public static class ProduceMaintenanceCheckHandler
{
    public static Task Handle(CreateFailureMaintenanceCheck command, IRepository<MaintenanceCheck> repository)
    {
        var maintenanceCheck = new MaintenanceCheck(command);
        return repository.Create(maintenanceCheck);
    }
}