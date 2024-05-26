using Cerverus.Core.Domain;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews;

public static class Handler
{
    public static async Task Handle(CompleteTrainingReview command, IRepository<TrainingReview> repository, CancellationToken cancellationToken)
    {
        var trainingReview = await repository.RehydrateOrThrow(command.TrainingReviewId);
        trainingReview.Complete(command.Reviews, string.Empty);
        await repository.Save(trainingReview);
    }
}