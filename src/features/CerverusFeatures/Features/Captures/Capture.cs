using Cerverus.Core.Domain;
using NodaTime;

namespace Cerverus.Features.Features.Captures;

public partial class Capture: AggregateRoot
{
    
    public Instant At { get; private set; }
    
    public string FilePath { get; private set; }
    
    public string CameraId { get; private set; }
    
    public CaptureError? Error { get; private set; }
    
    public bool Successful => Error == null;
    
    public Capture(){}
}

public enum CaptureErrorType
{
    AuthenticationError,
    ConnectionError,
    CaptureError,
    UnknownError
}

public record CaptureError(string Message, CaptureErrorType Type);