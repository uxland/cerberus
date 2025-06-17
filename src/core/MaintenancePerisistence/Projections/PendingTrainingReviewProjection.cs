using Cerberus.Maintenance.Features.Features.TrainingReviews;
using Cerberus.Maintenance.Features.Features.TrainingReviews.Create;
using Cerberus.Maintenance.Features.Features.TrainingReviews.ListPendingReviewByLocation;
using JasperFx.Events;
using Marten;
using Marten.Events;
using Marten.Events.Aggregation;

namespace Cerberus.Maintenance.Persistence.Projections;

public class PendingTrainingReviewProjection: SingleStreamProjection<PendingTrainingReview, string>
{
    public PendingTrainingReviewProjection()
    {
        DeleteEvent<TrainingReviewFulfilled>();
    }

    public Task<PendingTrainingReview> Create(IEvent<TrainingReviewCreated> e, IQuerySession querySession)
    {
        var description = querySession.GetCameraPathDescription(e.Data.CaptureInfo.CameraPath);
        return Task.FromResult(new PendingTrainingReview(
            Id: e.StreamKey!,
            Description: description,
            CameraPath: e.Data.CaptureInfo.CameraPath,
            CreatedAt: e.Data.Timestamp,
            ThumbnailUrl: e.Data.CaptureInfo.ThumbnailUri
        ));
    }
}