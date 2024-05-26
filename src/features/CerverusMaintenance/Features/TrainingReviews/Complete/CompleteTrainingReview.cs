using Cerverus.Core.Domain;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews;

public record CompleteTrainingReview(string TrainingReviewId, Dictionary<string, FilterResultReview> Reviews): ICommand;