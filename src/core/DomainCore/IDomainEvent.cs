

namespace Cerberus.Core.Domain;

public interface IDomainEvent
{
}

public interface IDomainEventHandler<in TEvent> 
    where TEvent : IDomainEvent
{
    void Apply(TEvent @event);
}