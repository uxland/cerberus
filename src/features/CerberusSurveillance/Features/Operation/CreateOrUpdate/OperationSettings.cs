namespace Cerberus.Surveillance.Features.Features.Operation.CreateOrUpdate;

public record OperationSettings(
    string Description,
    IEnumerable<IOperationQuestion> Questions
);