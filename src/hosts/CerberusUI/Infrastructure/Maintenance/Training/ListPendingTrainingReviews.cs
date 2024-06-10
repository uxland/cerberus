using Cerberus.Maintenance.Features.Features.TrainingReviews.LinstPendingReviewByLocation;
using Wolverine;

namespace Cerberus.UI.Infrastructure.Maintenance.Training;

public static class ListPendingTrainingReviewsHandler
{
    public static Task<List<PendingTrainingReview>> Handle(ListPendingTrainingReviews query, ApiClient apiClient)
    {
        return apiClient.GetItems<List<PendingTrainingReview>>($"locations/{query.Path}/pending-reviews");
    }
}

public record ListPendingTrainingReviews(string Path): ICommand;