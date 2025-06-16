using System.Collections.Concurrent;
using Cerberus.Core.Domain;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NodaTime;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.Streaming;

public interface IStreamRegistry
{
    Task<StreamingSession> StartStreamAsync(string cameraId);
    Task StopStreamAsync(string cameraId);
    StreamingSession? GetSession(string cameraId);
}

internal class StreamingRegistry(IClock clock, 
    ICameraStreamingController cameraStreamingController, 
    IReadModelQueryProvider queryProvider, 
    ILogger<StreamingRegistry> logger, 
    IOptions<StreamingOptions> streamingOptions) : IStreamRegistry
{
    private static readonly ConcurrentDictionary<string, StreamingSession> Sessions = new();

    public Task<StreamingSession> StartStreamAsync(string cameraId)
    {
        var session = Sessions.GetOrAdd(cameraId, CreateSession);
        session.IncrementViewerCount();
        return Task.FromResult(session);
    }
    

    public async Task StopStreamAsync(string cameraId)
    {
        if (Sessions.TryGetValue(cameraId, out var session))
        {
            session.DecrementViewerCount();
            if (session.ViewerCount == 0)
            {
                await cameraStreamingController.StopStreamAsync(new StopStreamArgs("pod-name", cameraId));
                Sessions.TryRemove(cameraId, out _);
            }
        }
    }

    public StreamingSession? GetSession(string cameraId)
    {
        Sessions.TryGetValue(cameraId, out var session);
        return session;
    }

    private StreamingSession CreateSession(string cameraId)
    {
        var camera = queryProvider.RehydrateOrFail<Camera>(cameraId).Result;
        var rtspUrl = camera.AdminSettings.IpAddress!;
        try
        {
            cameraStreamingController.StartStreamAsync(new StartStreamArgs("pod-name", cameraId, rtspUrl, camera.MediaInfo?.Codec ?? "h265")).Wait();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to create streaming session for camera {CameraId}", cameraId);
        }
        
        var session = new StreamingSession(cameraId, streamingOptions.Value.StreamingUrl, "pod-name", clock.GetCurrentInstant());
        return session;
    }
    
}