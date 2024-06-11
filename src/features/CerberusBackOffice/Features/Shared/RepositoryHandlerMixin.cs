using Cerberus.Core.Domain;
using Cerberus.Core.Domain.Errors;

namespace Cerberus.BackOffice.Features.Shared;

public static class RepositoryHandlerMixin
{
    public static async Task<TEntity> Rehydrate<TEntity>(this IRepositoryHandlerMixin<TEntity> handlerMixin, string id) where TEntity : IEntity
    {
        var entity = await handlerMixin.Repository.Rehydrate(id);
        if(entity == null)
            throw new EntityNotFoundException(new EntityNotFoundError(typeof(TEntity), id));
        return entity;
    }
}

public interface IRepositoryHandlerMixin<TAggregateRoot> where TAggregateRoot : IEntity
{
    IRepositoryBase<TAggregateRoot> Repository { get; }
}