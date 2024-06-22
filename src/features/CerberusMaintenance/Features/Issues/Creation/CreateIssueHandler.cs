using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.Issues;

public static class CreateIssueHandler
{
    public static void Handle(CreateIssue createIssue, IGenericRepository repository)
    {
        var issue = new MaintenanceIssue(createIssue);
        repository.Create(issue);
    }
}