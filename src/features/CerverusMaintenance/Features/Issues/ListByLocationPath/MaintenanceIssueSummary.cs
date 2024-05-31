using Cerverus.Core.Domain;

namespace Cerverus.Maintenance.Features.Features.Issues.ListByLocationPath;

public record MaintenanceIssueSummary(
    string Id,
    string Path,
    string CameraId,
    string Description,
    MaintenanceIssueStatus Status) : IEntity
{
    public MaintenanceIssueSummary Apply(IssueResolutionStarted @event) =>
        this with { Status = @event.Status };
}