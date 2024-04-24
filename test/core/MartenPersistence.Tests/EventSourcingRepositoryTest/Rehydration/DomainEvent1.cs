using Cerverus.Core.Domain;

namespace Cerverus.Core.MartenPersistence.EventSourcingRepositoryTest.Rehydration;

public record DomainEvent1(string Message1) : IDomainEvent;