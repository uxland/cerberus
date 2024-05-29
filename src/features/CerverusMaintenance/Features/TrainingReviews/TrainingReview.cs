using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Shared;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews;

public partial class TrainingReview: AggregateRoot
{
    public TrainingReview(){}
    public string MaintenanceProcessId { get; set; }
    public string? PerformedBy { get; set; }
    public ZonedDateTime? PerformedAt { get; set; }
    public ZonedDateTime CreatedAt { get; set; }
    public CaptureInfo CaptureInfo { get; set; } = null!;
    public TrainingReviewStatus Status { get; set; }
    
    public Dictionary<string, FilterResult> OriginalResults { get; set; } = new();
    public Dictionary<string, FilterResultReview> ReviewResults { get; set; } = new();
    
    public List<AnalysisFailure> Failures { get; set; } = new();
    public List<FilterResult> FixedResults { get; set; } = new();
}