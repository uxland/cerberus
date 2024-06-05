namespace Cerverus.Core.Domain;

public interface IEntityQueryProvider<TEntity> : IRepositoryBase<TEntity> where TEntity : IEntity
{
    Task<string?> RehydrateAsJson(string id);
}