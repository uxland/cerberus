using Cerverus.Maintenance.Features.Features.TrainingReviews.GetPendingReviews;
using Wolverine;

namespace Cerverus.UI.Infrastructure.Maintenance.Training;

public static class ListPendingTrainingReviewsHandler
{
    public static Task<List<PendingTrainingReview>> Handle(ListPendingTrainingReviews query, ApiClient apiClient)
    {
        return apiClient.GetItems<List<PendingTrainingReview>>($"locations/{query.Path}/pending-reviews");
    }
}

public record ListPendingTrainingReviews(string Path): ICommand;