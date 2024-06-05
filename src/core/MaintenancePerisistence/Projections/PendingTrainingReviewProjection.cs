using Cerverus.Maintenance.Features.Features.TrainingReviews;
using Cerverus.Maintenance.Features.Features.TrainingReviews.Complete;
using Cerverus.Maintenance.Features.Features.TrainingReviews.GetPendingReviews;
using Marten;
using Marten.Events;
using Marten.Events.Aggregation;

namespace Cerverus.Maintenance.Persistence.Projections;

public class PendingTrainingReviewProjection: SingleStreamProjection<PendingTrainingReview>
{
    public PendingTrainingReviewProjection()
    {
        DeleteEvent<TrainingReviewFulfilled>();
    }

    public async Task<PendingTrainingReview> Create(IEvent<TrainingReviewCreated> e, IQuerySession querySession)
    {
        var description = querySession.GetCameraPathDescription(e.Data.CaptureInfo.CameraPath);
        return new PendingTrainingReview(
            Id: e.StreamKey!,
            Description: description,
            CameraPath: e.Data.CaptureInfo.CameraPath,
            CreatedAt: e.Data.Timestamp
        );
    }
}