using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.TrainingReviews;

public static class Handler
{
    public static async Task<TrainingReviewEnded> Handle(FulfillTrainingReview command, IGenericRepository repository, CancellationToken cancellationToken)
    {
        var trainingReview = await repository.RehydrateOrThrow<TrainingReview>(command.TrainingReviewId);
        var result = trainingReview.Fulfill(command.Reviews, string.Empty);
        repository.Save(trainingReview);
        return result;
    }
}