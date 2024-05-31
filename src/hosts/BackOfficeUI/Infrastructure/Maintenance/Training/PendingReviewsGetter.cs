using Cerverus.Maintenance.Features.Features.TrainingReviews.GetPendingReviews;

namespace BackOfficeUI.Infrastructure.Maintenance.Training;

public class PendingReviewsGetter(ApiClient apiClient)
{
    public async Task<List<PendingTrainingReview>> GetPendingReviews(string path)
    {
       var result = await apiClient.GetItems<List<PendingTrainingReview>>($"maintenance/locations/{path}/pending-reviews") ??
                    [];
       return result;
    }
    
}