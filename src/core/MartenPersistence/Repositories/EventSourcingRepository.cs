using Cerberus.Core.Domain;
using Marten;

namespace Cerberus.Core.MartenPersistence.Repositories;

public abstract class EventSourcingRepository<TAggregateRoot>(IDocumentSession session) : IRepository<TAggregateRoot>
    where TAggregateRoot : AggregateRoot, new()
{
    protected GenericEventSourcingRepository _genericEventSourcingRepository = new(session);
    public Task<TAggregateRoot?> Rehydrate(string id, long? version = null) =>
        this._genericEventSourcingRepository.Rehydrate<TAggregateRoot>(id, version);
    
    
    public Task Save(TAggregateRoot aggregateRoot) => this._genericEventSourcingRepository.Save(aggregateRoot);

    public Task Create(TAggregateRoot aggregateRoot) => this._genericEventSourcingRepository.Create(aggregateRoot);
    
}