using Cerverus.Core.Domain;
using Cerverus.Core.Domain.Errors;
using Marten;

namespace Cerverus.Core.MartenPersistence.Repositories;

public abstract class EventSourcingRepository<TAggregateRoot>(IDocumentSession session) : IRepository<TAggregateRoot>
    where TAggregateRoot : AggregateRoot, new()
{
    public async Task<TAggregateRoot?> Rehydrate(string id, long? version = null)
    {
        var events = await session.Events.FetchStreamAsync(id, version ?? 0);
        if(events.Count == 0)
            return null;
        var aggregate = new TAggregateRoot();
        foreach (var @event in events)
            aggregate.ApplyEvent((IDomainEvent)@event.Data);
        return aggregate;
    }
    
    public Task Save(TAggregateRoot aggregateRoot)
    {
        session.Events.Append(aggregateRoot.Id, aggregateRoot.GetUncommittedEvents());
        return Task.CompletedTask;
    }

    public Task Create(TAggregateRoot aggregateRoot)
    {
        session.Events.StartStream<TAggregateRoot>(aggregateRoot.Id, aggregateRoot.GetUncommittedEvents());
        return Task.CompletedTask;
    }
}