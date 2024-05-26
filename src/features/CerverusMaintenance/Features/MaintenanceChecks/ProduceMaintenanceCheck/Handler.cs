using Cerverus.Core.Domain;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

public static class ProduceMaintenanceCheckHandler
{
    public static Task Handle(CreateFailureMaintenanceCheck command, IRepository<MaintenanceCheck> repository)
    {
        var maintenanceCheck = new MaintenanceCheck(command);
        return repository.Create(maintenanceCheck);
    }
}