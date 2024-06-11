using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks.ProduceFromTrainingReview;

public static class CreateFromTrainingReviewHandler
{
    public static Task Handle(CreateMaintenanceCheckFromTrainingReview command,IRepository<MaintenanceChecks.MaintenanceCheck> repository)
    {
        var maintenanceCheck = new MaintenanceChecks.MaintenanceCheck(command);
        return repository.Create(maintenanceCheck);
    }
}