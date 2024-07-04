using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.Issues;

public static class EndMaintenanceIssueHandler
{
    public static async Task<MaintenanceIssueRevolved?> Handle(EndMaintenanceIssue command, IGenericRepository repository)
    {
        var issue = await repository.RehydrateOrThrow<MaintenanceIssue>(command.IssueId);
        var result = issue.End(SystemClock.Instance.GetCurrentInstant(), "MaintenanceUser", command);
        repository.Save(issue);
        return result;
    }
}