using Cerberus.Core.MartenPersistence.Repositories;
using Marten;

namespace Cerberus.Core.MartenPersistence.EventSourcingRepositoryTest.Rehydration;

internal class TestEventSourcingAggregateRepository(IDocumentSession documentSession)
    : EventSourcingRepository<TestEventSourcingAggregate>(documentSession);