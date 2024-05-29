using Cerverus.Core.Domain;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews;

public partial class TrainingReview:
    IDomainEventHandler<TrainingReviewCreated>
{
    public TrainingReview(CreateTrainingReview command)
    {
        this.Id = Guid.NewGuid().ToString();
        this.ApplyUncommittedEvent(new TrainingReviewCreated(command.MaintenanceProcessId, command.CaptureInfo, command.AnalysisResults, SystemClock.Instance.GetCurrentInstant().InUtc()));
    }

    public void Apply(TrainingReviewCreated @event)
    {
        this.MaintenanceProcessId = @event.MaintenanceProcessId;
        this.Status = TrainingReviewStatus.Pending;
        this.CaptureInfo = @event.CaptureInfo;
        this.OriginalResults = @event.AnalysisResults.ToDictionary(x => x.FilterId, x => x);
        this.CreatedAt = @event.Timestamp;
    }
}