using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.TrainingReviews;

public record FulfillTrainingReview(string TrainingReviewId, Dictionary<string, FilterResultReview> Reviews): ICommand;