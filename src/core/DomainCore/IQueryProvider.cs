namespace Cerverus.Core.Domain;

public interface IQueryProvider<TEntity> where TEntity : Entity
{
    Task<TEntity?> Rehydrate(string id);
}