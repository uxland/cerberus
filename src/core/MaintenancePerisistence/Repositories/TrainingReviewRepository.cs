using Cerverus.Core.MartenPersistence.Repositories;
using Cerverus.Maintenance.Features.Features.TrainingReviews;
using Marten;

namespace Cerverus.Maintenance.Persistence.Repositories;

public class TrainingReviewRepository(IDocumentSession session): EventSourcingRepository<TrainingReview>(session);