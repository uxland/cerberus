namespace Cerberus.Surveillance.Features.Features.Round;

public record Inspection(
    string CameraId,
    string OperationId,
    int Order
);