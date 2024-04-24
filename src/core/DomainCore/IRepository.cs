namespace Cerverus.Core.Domain;

public interface IRepository<TAggregateRoot> where TAggregateRoot : AggregateRoot
{
    Task<TAggregateRoot?> Rehydrate(string id, long? version = null);
    Task Save(TAggregateRoot aggregateRoot);
    Task Create(TAggregateRoot aggregateRoot);
}