using Cerverus.Core.Domain;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews.GetPendingReviews;

public interface IPendingTrainingReviewQueryProvider: IQueryProvider<PendingTrainingReview>
{
    public Task<IEnumerable<PendingTrainingReview>> ListByPath(string path);
    
    public Task<string> ListByPathAsJson(string path);
}