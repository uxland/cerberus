using Cerverus.Core.Domain;

namespace Cerverus.Core.MartenPersistence.EventSourcingRepositoryTest.Rehydration;

public record DomainEvent3(string Message3) : IDomainEvent;