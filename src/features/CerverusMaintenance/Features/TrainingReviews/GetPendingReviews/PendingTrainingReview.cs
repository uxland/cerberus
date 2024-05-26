using Cerverus.Core.Domain;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews.GetPendingReviews;

public record PendingTrainingReview(string Id, string CameraPath, Instant CreatedAt): IEntity
{
    public static PendingTrainingReview FromCreatedEvent(string id, TrainingReviewCreated @event) =>
        new(id, @event.CaptureInfo.CameraPath, @event.Timestamp);
}