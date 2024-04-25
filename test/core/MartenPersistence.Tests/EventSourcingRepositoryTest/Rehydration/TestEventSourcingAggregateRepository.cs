using Cerverus.Core.MartenPersistence.Repositories;
using Marten;

namespace Cerverus.Core.MartenPersistence.EventSourcingRepositoryTest.Rehydration;

internal class TestEventSourcingAggregateRepository(IDocumentSession documentSession)
    : EventSourcingRepository<TestEventSourcingAggregate>(documentSession);