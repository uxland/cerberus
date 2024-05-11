namespace Cerverus.Core.Domain;

public interface IQueryProvider<TEntity> where TEntity : IEntity
{
    Task<TEntity?> Rehydrate(string id);
}