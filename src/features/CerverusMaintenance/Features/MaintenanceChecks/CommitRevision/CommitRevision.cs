using Cerverus.Core.Domain;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

public record CommitRevisionCommand(string RevisionId) : ICommand;

public static class CommitRevisionHandler
{
    public static async Task Handle(CommitRevisionCommand command, IRepository<MaintenanceCheck> repository)
    {
        var maintenanceCheck = await repository.RehydrateOrThrow(command.RevisionId); 
        maintenanceCheck.CommitRevision(string.Empty, SystemClock.Instance.GetCurrentInstant());
        await repository.Save(maintenanceCheck);
    }
}