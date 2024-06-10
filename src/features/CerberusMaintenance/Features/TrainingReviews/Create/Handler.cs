using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.TrainingReviews.Create;

public static class Handler
{
    public static async Task Handle(CreateTrainingReview command, IRepository<TrainingReviews.TrainingReview> repository, CancellationToken cancellationToken)
    {
        var trainingReview = new TrainingReviews.TrainingReview(command);
        await repository.Create(trainingReview);
    }
}