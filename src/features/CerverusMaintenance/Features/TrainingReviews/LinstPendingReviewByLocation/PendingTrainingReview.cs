using System.Linq.Expressions;
using Cerverus.Core.Domain;
using Cerverus.Core.Domain.Spec;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews.GetPendingReviews;

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