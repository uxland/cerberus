using Cerverus.Maintenance.Features.Features.TrainingReviews;
using Cerverus.Maintenance.Features.Features.TrainingReviews.Complete;
using Cerverus.Maintenance.Features.Features.TrainingReviews.GetTrainingReview;
using Marten;
using Marten.Events;
using Marten.Events.Aggregation;

namespace Cerverus.Maintenance.Persistence.Projections;

public class TrainingReviewDetailProjection : SingleStreamProjection<TrainingReviewDetail>
{
    public async Task<TrainingReviewDetail> Create(IEvent<TrainingReviewCreated> e, IQuerySession querySession)
    {
        var description = querySession.GetCameraPathDescription(e.Data.CaptureInfo.CameraPath);
        return new TrainingReviewDetail(
            Id: e.StreamKey!,
            CameraPath: e.Data.CaptureInfo.CameraPath,
            Description: description,
            CreatedAt: e.Data.Timestamp,
            CaptureInfo: e.Data.CaptureInfo,
            Status: TrainingReviewStatus.Pending,
            OriginalResults: e.Data.AnalysisResults.ToDictionary(x => x.FilterId)
        );
    }

    public static TrainingReviewDetail Project(TrainingReviewDetail detail, TrainingReviewFulfilled @event)
    {
        var execution = new TrainingReviewDetail.TrainingReviewExecutionDetail(PerformedById: @event.UserId,
            PerformedByName: @event.UserId, PerformedAt: @event.At);
        return detail.Fulfill(@event, execution);
    }
    
}