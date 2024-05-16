using Cerverus.Core.Domain;
using Marten;

namespace Cerverus.Core.MartenPersistence.QueryProviders;

public abstract class QueryProvider<TEntity>(IQuerySession session): IQueryProvider<TEntity> where TEntity : IEntity
{
    protected IQuerySession Session { get; } = session;
    public Task<TEntity?> Rehydrate(string id, long? version = null)
    {
       return this.Session.LoadAsync<TEntity>(id);
    }
}