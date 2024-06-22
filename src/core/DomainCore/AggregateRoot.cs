using System.Collections.Concurrent;
using System.Reflection;

namespace Cerberus.Core.Domain;

public abstract class AggregateRoot : Entity
{
    private static readonly ConcurrentDictionary<Type, ConcurrentDictionary<Type, MethodInfo>> EventAppliersByType =
        new();

    private readonly List<IDomainEvent> _uncommittedEvents = new();

    protected AggregateRoot()
    {
    }

    protected AggregateRoot(string id) : base(id)
    {
    }


    public long Version { get; private set; }

    private static MethodInfo GetApplier<TRoot, TEvent>(TRoot aggregateRoot, TEvent @event)
        where TRoot : AggregateRoot
        where TEvent : IDomainEvent
    {
        var type = aggregateRoot.GetType();
        var candidates = GetTypeEventAppliers(type);
        return GetApplier(candidates, type, @event);
    }

    private static ConcurrentDictionary<Type, MethodInfo> GetTypeEventAppliers(Type type)
    {
        return EventAppliersByType.GetOrAdd(type, _ => new ConcurrentDictionary<Type, MethodInfo>());
    }

    private static MethodInfo GetApplier<TEvent>(ConcurrentDictionary<Type, MethodInfo> candidates, Type type,
        TEvent @event) where TEvent : IDomainEvent
    {
        var eventType = @event.GetType();
        return candidates.GetOrAdd(eventType, _ => GetEventApplier(type, eventType));
    }

    private static MethodInfo GetEventApplier(Type type, Type eventType)
    {
        var method = type.GetMethod("Apply", BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public, null,
            new[] { eventType }, null);
        if (method is null)
            throw new MissingMethodException($"Method Apply({eventType.Name}) not found in {type.Name}");
        return method;
    }

    public void ApplyEvent<T>(T @event) where T : IDomainEvent
    {
        Version++;
        ApplyEventInner(@event);
    }

    public void ApplyUncommittedEvent(IDomainEvent @event)
    {
        _uncommittedEvents.Add(@event);
        ApplyEvent(@event);
    }

    public IReadOnlyList<IDomainEvent> GetUncommittedEvents()
    {
        return _uncommittedEvents.AsReadOnly();
    }

    public T? GeFirstUncommittedEventOfType<T>() where T : IDomainEvent
    {
        return _uncommittedEvents.OfType<T>().FirstOrDefault();
    }

    private void ApplyEventInner(IDomainEvent @event)
    {
        var applier = GetApplier(this, @event);
        applier.Invoke(this, new object[] { @event });
    }
}