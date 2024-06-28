using System.Linq.Expressions;
using Cerberus.Core.Domain;
using Cerberus.Core.Domain.Spec;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.Issues.ListByLocationPath;

public record PendingMaintenanceIssueSummary(
    string Id,
    string Path,
    string CameraId,
    string Description,
    string Summary,
    MaintenanceIssueStatus Status,
    Instant CreatedAt,
    Instant? StartedAt = null) : IEntity
{
    public PendingMaintenanceIssueSummary Apply(IssueResolutionStarted @event) =>
        this with
        {
            Status = @event.Status,
            StartedAt = @event.At
        };
}

internal class IssueStatusSpec(MaintenanceIssueStatus status) : Specification<PendingMaintenanceIssueSummary>
{
    public override bool IsSatisfiedBy(PendingMaintenanceIssueSummary item)
    {
        return item.Status == status;
    }

    public override Expression<Func<PendingMaintenanceIssueSummary, bool>> ToExpression() =>
        x => x.Status == status;
}

internal class IssueInLocationSpec(string locationPath) : Specification<PendingMaintenanceIssueSummary>
{
    public override bool IsSatisfiedBy(PendingMaintenanceIssueSummary item)
    {
        return item.Path.StartsWith(locationPath);
    }

    public override Expression<Func<PendingMaintenanceIssueSummary, bool>> ToExpression() =>
        x => x.Path.StartsWith(locationPath);
}