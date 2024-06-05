using System.Linq.Expressions;
using Cerverus.Core.Domain;
using Marten;

namespace Cerverus.Maintenance.Persistence.QueryProviders;

public class MaintenanceQueryProvider(IQuerySession querySession)
{
    public Task<T?> Rehydrate<T>(string id) where T : class, IEntity
    {
        return querySession.LoadAsync<T>(id);
    }
    public Task<string?> RehydrateAsJson<T>(string id) where T : class, IEntity
    {
        return querySession.Json.FindByIdAsync<T>(id);
    }
    
    public Task<IReadOnlyList<T>> List<T>(Expression<Func<T, bool>> predicate) where T : class, IEntity
    {
        return querySession.Query<T>().Where(predicate).ToListAsync();
    }
}