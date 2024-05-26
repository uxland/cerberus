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