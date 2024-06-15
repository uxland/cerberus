using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks.CommitRevision;

public record CommitRevisionCommand(string RevisionId, List<FilterResult> RevisionResults) : ICommand;

public static class CommitRevisionHandler
{
    public static async Task Handle(CommitRevisionCommand command, IRepository<MaintenanceChecks.MaintenanceCheck> repository)
    {
        var maintenanceCheck = await repository.RehydrateOrThrow(command.RevisionId); 
        maintenanceCheck.CommitRevision( command, string.Empty, SystemClock.Instance.GetCurrentInstant());
        repository.Save(maintenanceCheck);
    }
}