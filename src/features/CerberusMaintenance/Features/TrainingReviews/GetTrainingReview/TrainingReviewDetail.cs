using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis;
using Cerberus.Maintenance.Features.Features.Shared;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.TrainingReviews.GetTrainingReview;

public record TrainingReviewDetail(
    string Id,
    string CameraPath,
    string Description,
    Instant CreatedAt,
    CaptureInfo CaptureInfo,
    TrainingReviewStatus Status,
    Dictionary<string, FilterResult> OriginalResults,
    TrainingReviewDetail.TrainingReviewExecutionDetail? Execution = null,
    List<FilterResult>? FixedResults = null,
    Dictionary<string, FilterResultReview>? Revision = null,
    List<AnalysisFailure>? AnalysisFailures = null) : IEntity
{
    public record TrainingReviewExecutionDetail(string PerformedById, string PerformedByName, Instant PerformedAt);
    
    public TrainingReviewDetail Fulfill(TrainingReviewFulfilled @event, TrainingReviewExecutionDetail execution)
    {
        return this with
        {
            Status = TrainingReviewStatus.Completed,
            Execution = execution,
            FixedResults = @event.FixedResults,
            Revision = @event.Reviews,
            AnalysisFailures = @event.Failures,
        };
    }
}