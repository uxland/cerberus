namespace Cerberus.Surveillance.Features.Features.Round;

public record Inspection(
    string Id,
    string CameraId,
    string OperationId,
    int Order
);