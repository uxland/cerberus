using Cerberus.Core.Domain;
using Marten;

namespace Cerberus.Core.MartenPersistence.Repositories;

public abstract class DocumentStoreRepository<TAggregateRoot>(IDocumentSession session) : IRepository<TAggregateRoot>
    where TAggregateRoot : AggregateRoot
{
    public Task<TAggregateRoot?> Rehydrate(string id, long? version = null)
    {
        return session.LoadAsync<TAggregateRoot>(id);
    }

    public void Save(TAggregateRoot aggregateRoot)
    {
        session.Store(aggregateRoot);
    }

    public void Create(TAggregateRoot aggregateRoot)
    {
        Save(aggregateRoot);
    }
}