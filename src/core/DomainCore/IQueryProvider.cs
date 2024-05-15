namespace Cerverus.Core.Domain;

public interface IQueryProvider<TEntity>: IRepositoryBase<TEntity> where TEntity : IEntity{}