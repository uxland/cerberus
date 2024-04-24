namespace Cerverus.Core.Domain.Errors;

public class EntityNotFoundError(Type type, string id) : DomainError($"Entity of type {type.Name} with id {id} not found.");