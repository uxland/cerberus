using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.TrainingReviews.Complete;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews;

public partial class TrainingReview:
    IDomainEventHandler<TrainingReviewFulfilled>
{
    public TrainingReviewEnded Fulfill(Dictionary<string, FilterResultReview> reviews, string userId)
    {
        if(this.Status == TrainingReviewStatus.Completed)
            throw new InvalidOperationException("Training review is already completed");
        var (failures, fixedResults) = this.CalculateFailures(reviews);
        this.ApplyUncommittedEvent(new TrainingReviewFulfilled(this.MaintenanceProcessId, userId, reviews, SystemClock.Instance.GetCurrentInstant(), failures, fixedResults));
        return new TrainingReviewEnded(this.MaintenanceProcessId, this.Failures!, this.FixedResults!, this.Execution!.PerformedBy ?? string.Empty);
    }

    public void Apply(TrainingReviewFulfilled @event)
    {
        this.Revision = @event.Reviews;
        this.Execution = new TrainingReviewExecution(@event.UserId, @event.At);
        this.Failures = @event.Failures;
        this.FixedResults = @event.FixedResults;
        this.Status = TrainingReviewStatus.Completed;
    }
    
    private (List<AnalysisFailure> Failures, List<FilterResult> FixedResults) CalculateFailures(Dictionary<string, FilterResultReview> reviews)
    {
        var failures = new List<AnalysisFailure>();
        var fixedResults = new List<FilterResult>();
        foreach (var (key, analysisResult) in this.OriginalResults)
        {
            if(!reviews.TryGetValue(key, out var reviewResult))
                throw new InvalidOperationException("Review result not found for filter " + key);
            var agreement = reviewResult.Agreement;
            var fixedValue = analysisResult.Result && agreement;
            fixedResults.Add(analysisResult with{Result =fixedValue});
            if(!agreement)
                failures.Add(new AnalysisFailure(key, analysisResult.Result ? AnalysisFailureType.FalsePositive : AnalysisFailureType.FalseNegative, reviewResult));
        }
        return (failures, fixedResults);
    }
}

public record TrainingReviewEnded(string MaintenanceProcessId, List<AnalysisFailure> Failures, List<FilterResult> FilterResults, string ReviewedBy);