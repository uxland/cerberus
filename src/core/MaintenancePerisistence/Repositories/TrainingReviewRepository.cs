using Cerberus.Core.MartenPersistence.Repositories;
using Cerberus.Maintenance.Features.Features.TrainingReviews;
using Marten;

namespace Cerberus.Maintenance.Persistence.Repositories;

public class TrainingReviewRepository(IDocumentSession session): EventSourcingRepository<TrainingReview>(session);