using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks.ProduceCaptureFailureMaintenanceCheck;

public static class ProduceCaptureFailureHandler
{
    public static async Task Handle(CreateFailureMaintenanceCheck command, IRepository<MaintenanceChecks.MaintenanceCheck> repository)
    {
        var maintenanceCheck = new MaintenanceChecks.MaintenanceCheck(command);
        await repository.Create(maintenanceCheck);
    }
}