using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.TrainingReviews.Complete;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews;

public partial class TrainingReview:
    IDomainEventHandler<TrainingReviewCompleted>
{
    public void Complete(Dictionary<string, FilterResultReview> reviews, string userId)
    {
        if(this.Status == TrainingReviewStatus.Completed)
            throw new InvalidOperationException("Training review is already completed");
        var (failures, fixedResults) = this.CalculateFailures(reviews);
        this.ApplyUncommittedEvent(new TrainingReviewCompleted(this.MaintenanceProcessId, userId, reviews, SystemClock.Instance.GetCurrentInstant().InUtc(), failures, fixedResults));
    }

    public void Apply(TrainingReviewCompleted @event)
    {
        this.ReviewResults = @event.Reviews;
        this.PerformedBy = @event.UserId;
        this.PerformedAt = @event.At;
        this.Failures = @event.Failures;
        this.FixedResults = @event.FixedResults;
        this.Status = TrainingReviewStatus.Completed;
    }
    
    private (List<AnalysisFailure> Failures, List<FilterResult> FixedResults) CalculateFailures(Dictionary<string, FilterResultReview> reviews)
    {
        var result = new List<AnalysisFailure>();
        var filterResults = new List<FilterResult>();
        foreach (var (key, analysisResult) in this.OriginalResults)
        {
            if(!reviews.TryGetValue(key, out var reviewResult))
                throw new InvalidOperationException("Review result not found for filter " + key);
            filterResults.Add(analysisResult with{Result = reviewResult.Result});
            if(reviewResult.Result != analysisResult.Result)
                result.Add(new AnalysisFailure(key, analysisResult.Result ? AnalysisFailureType.FalsePositive : AnalysisFailureType.FalseNegative, reviewResult));
        }
        return (result, filterResults);
    }
}