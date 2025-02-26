namespace Cerberus.Surveillance.Features.Features.Round.Get;

public record InspectionDetail(string Id, string CameraId, string CameraDescription, string OperationId, string OperationDescription, int Order, string? StreamingUrl);