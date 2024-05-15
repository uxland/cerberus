namespace Cerverus.Core.Domain;

public interface IRepository<TAggregateRoot>: IRepositoryBase<TAggregateRoot> where TAggregateRoot : AggregateRoot
{
    Task Save(TAggregateRoot aggregateRoot);
    Task Create(TAggregateRoot aggregateRoot);
}

public interface IRepositoryBase<TEntity> where TEntity : IEntity
{
    Task<TEntity?> Rehydrate(string id, long? version = null);
}