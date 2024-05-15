using Cerverus.Core.Domain;
using Marten;

namespace Cerverus.Core.MartenPersistence.QueryProviders;

public abstract class QueryProvider<TEntity>(IQuerySession querySession): IQueryProvider<TEntity> where TEntity : IEntity
{
    protected IQuerySession Session { get; } = querySession;
    public Task<TEntity?> Rehydrate(string id, long? version = null)
    {
       return this.Session.LoadAsync<TEntity>(id);
    }
}