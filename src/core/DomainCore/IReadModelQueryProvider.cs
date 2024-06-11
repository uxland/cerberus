using System.Linq.Expressions;
using Cerberus.Core.Domain.Spec;

namespace Cerberus.Core.Domain;

public interface IReadModelQueryProvider
{
    public Task<string?> RehydrateAsJson<TEntity>(string id) where TEntity : class, IEntity;
    
    public Task<TEntity?> Rehydrate<TEntity>(string id) where TEntity : class, IEntity;
    
    public Task<string> ListAsJson<TEntity>(Specification<TEntity>? specification = null, params string[] orderBy) where TEntity : class, IEntity;
    
    public Task<string> ProjectListAsJson<TEntity, TResult>(Expression<Func<TEntity, TResult>> projection, Specification<TEntity>? specification = null,  params string[] orderBy) where TEntity : class, IEntity;
    
    public Task<IReadOnlyList<TEntity>> List<TEntity>(Specification<TEntity>? specification = null, params string[] orderBy) where TEntity : class, IEntity;
    public Task<IReadOnlyList<TResult>> ProjectList<TEntity, TResult>(Expression<Func<TEntity, TResult>> projection, Specification<TEntity>? specification = null, params string[] orderBy) where TEntity : class, IEntity;
    
}