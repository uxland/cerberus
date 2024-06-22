using System.Linq.Expressions;
using Cerberus.Core.Domain;
using Cerberus.Core.Domain.Spec;
using Marten;

namespace Cerberus.Core.MartenPersistence.QueryProviders;

public class ReadModelQueryProvider(IQuerySession querySession) : IReadModelQueryProvider
{
    public Task<string?> RehydrateAsJson<TEntity>(string id) where TEntity : class, IEntity
    {
        return querySession.Json.FindByIdAsync<TEntity>(id);
    }

    public Task<TEntity?> Rehydrate<TEntity>(string id) where TEntity : class, IEntity
    {
        return querySession.LoadAsync<TEntity>(id);
    }

    public Task<string> ListAsJson<TEntity>(Specification<TEntity>? specification, params string[] orderby)
        where TEntity : class, IEntity
    {
        return BuildQuery(specification, orderby).ToJsonArray();
    }

    public Task<string> ProjectListAsJson<TEntity, TResult>(Expression<Func<TEntity, TResult>> projection,
        Specification<TEntity>? specification = null,
        params string[] orderBy) where TEntity : class, IEntity
    {
        return BuildProjectedQuery(projection, specification, orderBy)
            .ToJsonArray();
    }

    public Task<IReadOnlyList<TEntity>> List<TEntity>(Specification<TEntity>? specification, params string[] orderBy)
        where TEntity : class, IEntity
    {
        return BuildQuery(specification, orderBy)
            .ToListAsync();
    }

    public Task<IReadOnlyList<TResult>> ProjectList<TEntity, TResult>(Expression<Func<TEntity, TResult>> projection,
        Specification<TEntity>? specification = null, params string[] orderBy) where TEntity : class, IEntity
    {
        return BuildProjectedQuery(projection, specification, orderBy)
            .ToListAsync();
    }

    private IQueryable<TResult> BuildProjectedQuery<TEntity, TResult>(Expression<Func<TEntity, TResult>> projection,
        Specification<TEntity>? specification, params string[] orderBy) where TEntity : class, IEntity
    {
        return BuildQuery(specification, orderBy)
            .Select(projection);
    }

    private IQueryable<TEntity> BuildQuery<TEntity>(Specification<TEntity>? specification, params string[] orderBy)
        where TEntity : class, IEntity
    {
        IQueryable<TEntity> query = querySession.Query<TEntity>();
        query = specification != null ? query.Where(specification.ToExpression()) : query;
        query = orderBy.Length > 0 ? query.OrderBy(orderBy) : query;
        return query;
    }
}