using Cerverus.Core.Domain;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews;

public static class Handler
{
    public static async Task<TrainingReviewEnded> Handle(FulfillTrainingReview command, IRepository<TrainingReview> repository, CancellationToken cancellationToken)
    {
        var trainingReview = await repository.RehydrateOrThrow(command.TrainingReviewId);
        var result = trainingReview.Fulfill(command.Reviews, string.Empty);
        await repository.Save(trainingReview);
        return result;
    }
}