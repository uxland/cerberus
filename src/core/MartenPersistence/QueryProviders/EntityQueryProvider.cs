using System.Linq.Expressions;
using Cerverus.Core.Domain;
using Marten;

namespace Cerverus.Core.MartenPersistence.QueryProviders;

public abstract class EntityQueryProvider<TEntity>(IQuerySession session): IEntityQueryProvider<TEntity> where TEntity : class, IEntity
{
    protected IQuerySession Session { get; } = session;
    public Task<TEntity?> Rehydrate(string id, long? version = null)
    {
       return this.Session.LoadAsync<TEntity>(id);
    }

    public Task<string?> RehydrateAsJson(string id)
    {
        return this.Session.Json.FindByIdAsync<TEntity>(id);
    }
    
    protected Task<string> ListAsJson(Expression<Func<TEntity, bool>> predicate)
    {
        return this.Session.Query<TEntity>().Where(predicate).ToJsonArray();
    }
}