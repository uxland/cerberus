using Cerverus.Maintenance.Features.Features.TrainingReviews;

namespace BackOfficeUI.Infrastructure.Maintenance.Training;

public class TrainingReviewGetter(ApiClient apiClient)
{
    public async Task<TrainingReview?> Get(string id)
    {
        var result = await apiClient.GetItems<TrainingReview>($"training-reviews/{id}") ??
                     null;
        return result;
    }
}