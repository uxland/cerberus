namespace Cerberus.Surveillance.Features.Features.Round;

public interface IInspection
{
    string Id { get; }
    string CameraId { get; }
    string CameraDescription { get; }
    string? StreamingUrl { get; }
    string OperationId { get; }
    string OperationDescription { get; }
    int Order { get; }
}