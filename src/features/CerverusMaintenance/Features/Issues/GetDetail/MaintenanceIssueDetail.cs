using Cerverus.BackOffice.Features.Captures;
using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.TrainingReviews;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.Issues.GetDetail;

public record MaintenanceIssueDetail(
    string Id,
    string? SnapshotUrl,
    string CameraId,
    string CameraPath,
    string CameraDescription,
    CaptureError? CaptureError,
    List<FilterResult> Errors,
    MaintenanceIssueStatus Status,
    string? ResolutionComment = null,
    Instant? StartedAt = null,
    string? StartedBy = null,
    string? FinishedBy = null,
    Instant? FinishedAt = null
) : IEntity
{
    public MaintenanceIssueDetail Apply(IssueResolutionStarted e)
    {
        return this with
        {
            Status = e.Status,
            StartedBy = e.By,
            StartedAt = e.At
        };
    }
    
    public MaintenanceIssueDetail Apply(MaintenanceIssueEnded e)
    {
        return this with
        {
            Status = e.Status,
            ResolutionComment = e.Comment,
            FinishedBy = e.By,
            FinishedAt = e.At
        };
    }
}