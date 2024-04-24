using Cerverus.Core.Domain;

namespace Cerverus.Core.MartenPersistence.EventSourcingRepositoryTest.Rehydration;

public record DomainEvent2(string Message2) : IDomainEvent;