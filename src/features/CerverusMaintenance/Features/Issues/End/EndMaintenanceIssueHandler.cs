using Cerverus.Core.Domain;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.Issues;

public static class EndMaintenanceIssueHandler
{
    public static async Task<MaintenanceIssueRevolved?> Handle(EndMaintenanceIssue command, IRepository<MaintenanceIssue> repository)
    {
        var issue = await repository.RehydrateOrThrow(command.IssueId);
        var result = issue.End(SystemClock.Instance.GetCurrentInstant(), "MaintenanceUser", command);
        await repository.Save(issue);
        return result;
    }
}