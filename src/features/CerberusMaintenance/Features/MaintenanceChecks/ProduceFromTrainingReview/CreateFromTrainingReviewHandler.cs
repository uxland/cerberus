using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks.ProduceFromTrainingReview;

public static class CreateFromTrainingReviewHandler
{
    public static void Handle(CreateMaintenanceCheckFromTrainingReview command,IGenericRepository repository)
    {
        var maintenanceCheck = new MaintenanceChecks.MaintenanceCheck(command);
        repository.Create(maintenanceCheck);
    }
}