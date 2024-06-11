using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.Issues;

public static class CreateIssueHandler
{
    public static Task Handle(CreateIssue createIssue, IRepository<MaintenanceIssue> repository)
    {
        var issue = new MaintenanceIssue(createIssue);
        return repository.Create(issue);
    }
}