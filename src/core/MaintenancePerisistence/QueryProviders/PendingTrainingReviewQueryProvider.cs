using Cerverus.Core.MartenPersistence.QueryProviders;
using Cerverus.Maintenance.Features.Features.TrainingReviews.GetPendingReviews;
using Marten;

namespace Cerverus.Maintenance.Persistence.QueryProviders;

public class PendingTrainingReviewQueryProvider(IQuerySession session): QueryProvider<PendingTrainingReview>(session), IPendingTrainingReviewQueryProvider
{
    public async Task<IEnumerable<PendingTrainingReview>> ListByPath(string path)
    {
        return await this.ListByPathQueryable(path)
            .ToListAsync();
    }

    public Task<string> ListByPathAsJson(string path)
    {
        return this.ListByPathQueryable(path)
            .ToJsonArray();
    }
    
    private IQueryable<PendingTrainingReview> ListByPathQueryable(string path)
    {
        return this.Session.Query<PendingTrainingReview>().Where(x => x.CameraPath.StartsWith(path));
    }
}