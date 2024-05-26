using Cerverus.Core.Domain;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

public static class ProduceCaptureFailureHandler
{
    public static async Task Handle(CreateFailureMaintenanceCheck command, IRepository<MaintenanceCheck> repository)
    {
        var maintenanceCheck = new MaintenanceCheck(command);
        await repository.Create(maintenanceCheck);
    }
}