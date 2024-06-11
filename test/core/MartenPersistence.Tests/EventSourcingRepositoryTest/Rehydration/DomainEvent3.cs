using Cerberus.Core.Domain;

namespace Cerberus.Core.MartenPersistence.EventSourcingRepositoryTest.Rehydration;

public record DomainEvent3(string Message3) : IDomainEvent;