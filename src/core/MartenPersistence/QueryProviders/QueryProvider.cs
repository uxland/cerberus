using Cerverus.Core.Domain;
using Marten;

namespace Cerverus.Core.MartenPersistence.QueryProviders;

public class QueryProvider<TEntity>(IDocumentStore documentStore): IQueryProvider<TEntity> where TEntity : Entity
{
    private IQuerySession? _session;
    protected IQuerySession Session => _session ??= documentStore.QuerySession();
    public Task<TEntity?> Rehydrate(string id)
    {
       return this.Session.LoadAsync<TEntity>(id);
    }
}