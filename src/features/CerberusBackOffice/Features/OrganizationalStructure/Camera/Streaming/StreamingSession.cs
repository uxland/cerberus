using NodaTime;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.Streaming;

public class StreamingSession(string cameraId, string streamUrl, string podName, Instant startedAt)
{
    private int _viewerCount = 0;
    public string CameraId { get; } = cameraId;
    public string StreamUrl { get; } = streamUrl;
    public string PodName { get; } = podName;
    public Instant StartedAt { get; } = startedAt;
    public int ViewerCount { get; private set; } = 0;
    
    public int IncrementViewerCount()
    {
        return Interlocked.Increment(ref _viewerCount);
    }
    public int DecrementViewerCount()
    {
        return Interlocked.Decrement(ref _viewerCount);
    }
}