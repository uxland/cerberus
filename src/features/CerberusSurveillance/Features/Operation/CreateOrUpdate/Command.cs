using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Operation.CreateOrUpdate;

public record CreateOperation(
    OperationSettings Settings
    ) : ICommand;

public record UpdateOperation(
    string Id,
    OperationSettings Settings
    ) : ICommand;