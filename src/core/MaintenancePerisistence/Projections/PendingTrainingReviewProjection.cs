using Cerverus.Maintenance.Features.Features.TrainingReviews;
using Cerverus.Maintenance.Features.Features.TrainingReviews.GetPendingReviews;
using Marten.Events;
using Marten.Events.Aggregation;

namespace Cerverus.Maintenance.Persistence.Projections;

public class PendingTrainingReviewProjection: SingleStreamProjection<PendingTrainingReview>
{
    public PendingTrainingReviewProjection()
    {
        DeleteEvent<TrainingReviewCompleted>();
    }
    public PendingTrainingReview Create(IEvent<TrainingReviewCreated> e) => PendingTrainingReview.FromCreatedEvent(e.StreamKey!, e.Data);
}