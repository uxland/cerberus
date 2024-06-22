using Cerberus.Core.Domain.Errors;

namespace Cerberus.Core.Domain;

public interface IRepositoryBase<TEntity> where TEntity : IEntity
{
    Task<TEntity?> Rehydrate(string id, long? version = null);
}

public interface IGenericRepository
{
    void Save<TAggregateRoot>(TAggregateRoot aggregateRoot) where TAggregateRoot : AggregateRoot, new();
    void Create<TAggregateRoot>(TAggregateRoot aggregateRoot) where TAggregateRoot : AggregateRoot, new();

    Task<TAggregateRoot?> Rehydrate<TAggregateRoot>(string id, long? version = null)
        where TAggregateRoot : AggregateRoot, new();
}

public static class GenericRepositoryExtensions
{
    public static Task<TAggregateRoot> RehydrateOrThrow<TAggregateRoot>(this IGenericRepository repository, string id,
        long? version = null)
        where TAggregateRoot : AggregateRoot, new()
    {
        return repository.Rehydrate<TAggregateRoot>(id, version)
            .ContinueWith(t =>
            {
                if (t.Result == null)
                    throw new EntityNotFoundException(typeof(TAggregateRoot), id);
                return t.Result;
            });
    }
}