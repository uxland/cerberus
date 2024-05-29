using Cerverus.Core.Domain;
using Cerverus.Features.Features.Captures;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Shared;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks.CommitRevision;

public record MaintenanceCheckReviewed(
    CaptureInfo CaptureInfo,
    List<FilterResult> FilterResults,
    CaptureError? CaptureError,
    string ReviewerUser,
    ZonedDateTime At) : IDomainEvent
{
    public bool HasErrors => this.CaptureError != null || this.FilterResults.Any(x => !x.Result);
    public List<FilterResult> FilterErrors => this.FilterResults.Where(x => !x.Result).ToList();
}