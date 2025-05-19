namespace Cerberus.Surveillance.Features.Features.Operation;

public record OperationAction(string Description, List<OperationAction> Alternatives);

