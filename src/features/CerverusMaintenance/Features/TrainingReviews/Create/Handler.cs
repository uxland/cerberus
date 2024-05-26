using Cerverus.Core.Domain;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews.Create;

public static class Handler
{
    public static async Task Handle(CreateTrainingReview command, IRepository<TrainingReview> repository, CancellationToken cancellationToken)
    {
        var trainingReview = new TrainingReview(command);
        await repository.Create(trainingReview);
    }
}