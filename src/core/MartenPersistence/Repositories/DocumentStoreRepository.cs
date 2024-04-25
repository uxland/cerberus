using Cerverus.Core.Domain;
using Marten;

namespace Cerverus.Core.MartenPersistence.Repositories;

public abstract class DocumentStoreRepository<TAggregateRoot>(IDocumentSession session) : IRepository<TAggregateRoot>
    where TAggregateRoot : AggregateRoot
{
    protected readonly IDocumentSession Session = session;

    public Task<TAggregateRoot?> Rehydrate(string id, long? version = null)
    {
        return Session.LoadAsync<TAggregateRoot>(id);
    }

    public Task Save(TAggregateRoot aggregateRoot)
    {
        Session.Store(aggregateRoot);
        return Task.CompletedTask;
    }

    public Task Create(TAggregateRoot aggregateRoot)
    {
        return Save(aggregateRoot);
    }
}