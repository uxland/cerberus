using Cerverus.Maintenance.Features.Features.TrainingReviews;
using Cerverus.Maintenance.Features.Features.TrainingReviews.GetTrainingReview;
using Wolverine;

namespace BackOfficeUI.Infrastructure.Maintenance.Training;

public static class GetTrainingReviewHandler
{
    public static Task<TrainingReviewDetail?> Handle(GetTrainingReview query, ApiClient apiClient)
    {
        return apiClient.GetItems<TrainingReviewDetail>($"training-reviews/{query.Id}");
    }
}

public record GetTrainingReview(string Id): ICommand;