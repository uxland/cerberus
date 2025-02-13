using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Operation.Create;

public record CreateOperation(string? Id, string Name, IEnumerable<IOperationQuestion> Questions): ICommand;