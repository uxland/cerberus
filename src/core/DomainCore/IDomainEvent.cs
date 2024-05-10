using MediatR;

namespace Cerverus.Core.Domain;

public interface IDomainEvent : INotification
{
}

public interface IDomainEventHandler<in TEvent> 
    where TEvent : IDomainEvent
{
    void Apply(TEvent @event);
}