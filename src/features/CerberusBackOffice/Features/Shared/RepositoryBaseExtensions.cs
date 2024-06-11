using Cerberus.Core.Domain;
using Cerberus.Core.Domain.Errors;

namespace Cerberus.BackOffice.Features.Shared;

public static class RepositoryBaseExtensions
{
    public static async Task<TEntity> RehydrateOrFail<TEntity>(this IRepositoryBase<TEntity> repository, string id) where TEntity : IEntity
    {
        var entity = await repository.Rehydrate(id);
        if(entity == null)
            throw new EntityNotFoundException(new EntityNotFoundError(typeof(TEntity), id));
        return entity;
    }
}