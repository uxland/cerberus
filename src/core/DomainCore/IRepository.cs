using Cerverus.Core.Domain.Errors;

namespace Cerverus.Core.Domain;

public interface IRepository<TAggregateRoot>: IRepositoryBase<TAggregateRoot> where TAggregateRoot : AggregateRoot
{
    Task Save(TAggregateRoot aggregateRoot);
    Task Create(TAggregateRoot aggregateRoot);
    public Task<TAggregateRoot> RehydrateOrThrow(string id, long? version = null)
    {
        return this.Rehydrate(id, version)
            .ContinueWith(t =>
            {
                if (t.Result == null)
                    throw new EntityNotFoundException(typeof(TAggregateRoot), id);
                return t.Result;
            });
    }
    
}

public interface IRepositoryBase<TEntity> where TEntity : IEntity
{
    Task<TEntity?> Rehydrate(string id, long? version = null);
}

public interface IGenericRepository
{
    Task Save<TAggregateRoot>(TAggregateRoot aggregateRoot) where TAggregateRoot : AggregateRoot, new();
    Task Create<TAggregateRoot>(TAggregateRoot aggregateRoot) where TAggregateRoot : AggregateRoot, new();
    Task<TAggregateRoot?> Rehydrate<TAggregateRoot>(string id, long? version = null) where TAggregateRoot : AggregateRoot, new();
}

public static class GenericRepositoryExtensions
{
    public static Task<TAggregateRoot> RehydrateOrThrow<TAggregateRoot>(this IGenericRepository repository, string id, long? version = null)
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