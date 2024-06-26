﻿using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.TrainingReviews.Create;

public static class Handler
{
    public static void Handle(CreateTrainingReview command, IGenericRepository repository, CancellationToken cancellationToken)
    {
        var trainingReview = new TrainingReviews.TrainingReview(command);
        repository.Create(trainingReview);
    }
}