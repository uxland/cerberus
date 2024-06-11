using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis;
using Cerberus.Maintenance.Features.Features.Shared;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.TrainingReviews;

public partial class TrainingReview: AggregateRoot
{
    public TrainingReview(){}
    public string MaintenanceProcessId { get; set; }
    
    public TrainingReviewExecution? Execution { get; set; }
    public Instant CreatedAt { get; set; }
    public CaptureInfo CaptureInfo { get; set; } = null!;
    public TrainingReviewStatus Status { get; set; }
    
    public Dictionary<string, FilterResult> OriginalResults { get; set; } = new();
    public Dictionary<string, FilterResultReview>? Revision { get; set; }
    
    public List<AnalysisFailure>? Failures { get; set; }
    public List<FilterResult>? FixedResults { get; set; } 
    
    
}
public record TrainingReviewExecution(string PerformedBy, Instant PerformedAt);