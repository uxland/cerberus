using Cerverus.Core.Domain;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

public static class CreateFromTrainingReviewHandler
{
    public static Task Handle(CreateMaintenanceCheckFromTrainingReview command,IRepository<MaintenanceCheck> repository)
    {
        var maintenanceCheck = new MaintenanceCheck(command);
        return repository.Create(maintenanceCheck);
    }
}