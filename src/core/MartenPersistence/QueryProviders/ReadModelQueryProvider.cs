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

    public Task<string> ListAsJson<TEntity>(Specification<TEntity>? specification, int? skip, int? take, params string[] orderBy)
        where TEntity : class, IEntity
    {
        return BuildQuery(specification, skip, take, orderBy).ToJsonArray();
    }

    public Task<string> ProjectListAsJson<TEntity, TResult>(Expression<Func<TEntity, TResult>> projection,
        Specification<TEntity>? specification, int? skip, int? take,
        params string[] orderBy) where TEntity : class, IEntity
    {
        return BuildProjectedQuery(projection, specification, skip, take, orderBy)
            .ToJsonArray();
    }

    public Task<IReadOnlyList<TEntity>> List<TEntity>(Specification<TEntity>? specification, int? skip, int? take, params string[] orderBy)
        where TEntity : class, IEntity
    {
        return BuildQuery(specification, skip, take, orderBy)
            .ToListAsync();
    }

    public Task<IReadOnlyList<TResult>> ProjectList<TEntity, TResult>(Expression<Func<TEntity, TResult>> projection,
        Specification<TEntity>? specification, int? skip, int? take, params string[] orderBy) where TEntity : class, IEntity
    {
        return BuildProjectedQuery(projection, specification, skip, take, orderBy)
            .ToListAsync();
    }

    private IQueryable<TResult> BuildProjectedQuery<TEntity, TResult>(Expression<Func<TEntity, TResult>> projection,
        Specification<TEntity>? specification, int? skip, int? take, params string[] orderBy) where TEntity : class, IEntity
    {
        return BuildQuery(specification, skip, take, orderBy)
            .Select(projection);
    }

    private IQueryable<TEntity> BuildQuery<TEntity>(Specification<TEntity>? specification, int? skip, int? take, params string[] orderBy)
        where TEntity : class, IEntity
    {
        IQueryable<TEntity> query = querySession.Query<TEntity>();
        query = specification != null ? query.Where(specification.ToExpression()) : query;
        query = orderBy.Length > 0 ? query.OrderBy(orderBy) : query;
        query = skip.HasValue ? query.Skip(skip.Value) : query;
        query = take.HasValue ? query.Take(take.Value) : query;
        return query;
    }
}