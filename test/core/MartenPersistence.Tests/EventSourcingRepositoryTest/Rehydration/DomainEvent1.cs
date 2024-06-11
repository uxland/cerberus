using Cerberus.Core.Domain;

namespace Cerberus.Core.MartenPersistence.EventSourcingRepositoryTest.Rehydration;

public record DomainEvent1(string Message1) : IDomainEvent;