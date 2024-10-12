namespace Cerberus.Core.Domain.Errors;

public class EntityNotFoundError(Type type, string id)
    : DomainError($"Entity of type {type.Name} with id {id} not found.");

public class EntityNotFoundException(EntityNotFoundError error)
    : Exception(error.Message)
{
    public EntityNotFoundException(Type type, string id)
        : this(new EntityNotFoundError(type, id))
    {
    }
}

public class BusinessException(string message)
    : Exception(message);