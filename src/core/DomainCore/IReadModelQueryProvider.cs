using System.Linq.Expressions;
using Cerberus.Core.Domain.Errors;
using Cerberus.Core.Domain.Spec;

namespace Cerberus.Core.Domain;

public interface IReadModelQueryProvider
{
    public Task<string?> RehydrateAsJson<TEntity>(string id) where TEntity : class, IEntity;

    public Task<TEntity?> Rehydrate<TEntity>(string id) where TEntity : class, IEntity;

    public Task<string> ListAsJson<TEntity>(Specification<TEntity>? specification = null, int? skip = null, int? take = null,
        params string[] orderBy)
        where TEntity : class, IEntity;

    public Task<string> ProjectListAsJson<TEntity, TResult>(Expression<Func<TEntity, TResult>> projection,
        Specification<TEntity>? specification = null, int? skip = null, int? take = null,
        params string[] orderBy) where TEntity : class, IEntity;

    public Task<IReadOnlyList<TEntity>> List<TEntity>(Specification<TEntity>? specification = null, int? skip = null, int? take = null,
        params string[] orderBy) where TEntity : class, IEntity;

    public Task<IReadOnlyList<TResult>> ProjectList<TEntity, TResult>(Expression<Func<TEntity, TResult>> projection,
        Specification<TEntity>? specification = null, int? skip = null, int? take = null,
        params string[] orderBy) where TEntity : class, IEntity;
}

public static class ReadModelQueryProviderExtensions
{
    public static Task<TEntity> RehydrateOrFail<TEntity>(this IReadModelQueryProvider queryProvider, string id) where TEntity : class, IEntity
    {
        return queryProvider.Rehydrate<TEntity>(id)
            .ContinueWith(t =>
            {
                if (t.Result == null)
                    throw new EntityNotFoundException(new EntityNotFoundError(typeof(TEntity), id));
                return t.Result;
            });
    }
    public static Task<string> RehydrateAsJsonOrFail<TEntity>(this IReadModelQueryProvider queryProvider, string id) where TEntity : class, IEntity
    {
        return queryProvider.RehydrateAsJson<TEntity>(id)
            .ContinueWith(t =>
            {
                if (t.Result == null)
                    throw new EntityNotFoundException(new EntityNotFoundError(typeof(TEntity), id));
                return t.Result;
            });
    }
}