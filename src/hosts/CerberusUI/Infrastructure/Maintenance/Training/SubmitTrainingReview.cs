namespace Cerberus.UI.Infrastructure.Maintenance.Training;

public record SubmitTrainingReview(string Id, Dictionary<string, bool> Revision);

public static class SubmitTrainingReviewHandler
{
    public static Task Handle(SubmitTrainingReview command, ApiClient apiClient)
    {
        return apiClient.PutCommand($"training-reviews/{command.Id}", command.Revision);
    }
}