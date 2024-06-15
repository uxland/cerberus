using Cerberus.Core.Domain;
using Marten;

namespace Cerberus.Core.MartenPersistence.Repositories;

public abstract class EventSourcingRepository<TAggregateRoot>(IDocumentSession session) : IRepository<TAggregateRoot>
    where TAggregateRoot : AggregateRoot, new()
{
    private readonly GenericEventSourcingRepository _genericEventSourcingRepository = new(session);

    public Task<TAggregateRoot?> Rehydrate(string id, long? version = null)
    {
        return _genericEventSourcingRepository.Rehydrate<TAggregateRoot>(id, version);
    }


    public void Save(TAggregateRoot aggregateRoot)
    {
        _genericEventSourcingRepository.Save(aggregateRoot);
    }

    public void Create(TAggregateRoot aggregateRoot)
    {
        _genericEventSourcingRepository.Create(aggregateRoot);
    }
}