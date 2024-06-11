using System.Linq.Expressions;
using Cerberus.Core.Domain;
using Cerberus.Core.Domain.Spec;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.TrainingReviews.LinstPendingReviewByLocation;

public record PendingTrainingReview(string Id, string CameraPath, string Description, Instant CreatedAt): IEntity;

internal class ReviewInLocationSpec(string locationPath) : Specification<PendingTrainingReview>
{
    public override bool IsSatisfiedBy(PendingTrainingReview item)
    {
        return item.CameraPath.StartsWith(locationPath);
    }

    public override Expression<Func<PendingTrainingReview, bool>> ToExpression() =>
        x => x.CameraPath.StartsWith(locationPath);
}