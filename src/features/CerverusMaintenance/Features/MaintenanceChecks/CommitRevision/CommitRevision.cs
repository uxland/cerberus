using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.Analysis;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

public record CommitRevisionCommand(string RevisionId, List<FilterResult> RevisionResults) : ICommand;

public static class CommitRevisionHandler
{
    public static async Task Handle(CommitRevisionCommand command, IRepository<MaintenanceCheck> repository)
    {
        var maintenanceCheck = await repository.RehydrateOrThrow(command.RevisionId); 
        maintenanceCheck.CommitRevision( command, string.Empty, SystemClock.Instance.GetCurrentInstant().InUtc());
        await repository.Save(maintenanceCheck);
    }
}