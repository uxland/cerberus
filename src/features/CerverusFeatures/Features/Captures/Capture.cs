using Cerverus.Core.Domain;
using Cerverus.Features.Features.Captures.CaptureSnapshots;
using NodaTime;

namespace Cerverus.Features.Features.Captures;

public partial class Capture: AggregateRoot
{
    
    public ZonedDateTime At { get; set; }
    
    public string? SnapshotPath { get; set; }
    
    public string? ThumbnailPath { get; set; }
    
    public string CameraId { get; set; }
    
    public string CameraPath { get; set; }
    
    public CaptureError? Error { get; set; }
    
    public bool Successful => Error == null;
    
    public Capture(){}
    
}

public enum CaptureErrorType
{
    AuthenticationError,
    ConnectionError,
    ConnectionTimeout,
    CaptureError,
    UnknownError
}

public record CaptureError(string Message, CaptureErrorType Type);

public interface ICaptureQueryProvider
{
    Task<List<string>> GetCameraThumbnail(string cameraId);
    
    Task<string> GetCameraCaptures(string cameraId);
}