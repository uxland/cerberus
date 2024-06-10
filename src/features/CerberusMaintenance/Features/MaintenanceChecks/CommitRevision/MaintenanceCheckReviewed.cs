using Cerberus.BackOffice.Features.Captures;
using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis;
using Cerberus.Maintenance.Features.Features.Shared;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks.CommitRevision;

public record MaintenanceCheckReviewed(
    string MaintenanceProcessId,
    CaptureInfo CaptureInfo,
    List<FilterResult> FilterResults,
    CaptureError? CaptureError,
    string ReviewerUser,
    Instant At) : IDomainEvent
{
    public bool HasErrors => this.CaptureError != null || this.FilterResults.Any(x => !x.Result);
    public List<FilterResult> FilterErrors => this.FilterResults.Where(x => !x.Result).ToList();
}