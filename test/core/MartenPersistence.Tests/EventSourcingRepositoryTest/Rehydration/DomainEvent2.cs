using Cerberus.Core.Domain;

namespace Cerberus.Core.MartenPersistence.EventSourcingRepositoryTest.Rehydration;

public record DomainEvent2(string Message2) : IDomainEvent;