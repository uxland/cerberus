using System.Collections.Concurrent;
using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.Streaming;

public interface IStreamRegistry
{
    Task<StreamingSession> StartStreamAsync(string cameraId);
    Task StopStreamAsync(string cameraId);
    StreamingSession? GetSession(string cameraId);
}

internal class StreamingRegistry(IClock clock, ICameraStreamingController cameraStreamingController, IReadModelQueryProvider queryProvider) : IStreamRegistry
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
        cameraStreamingController.StartStreamAsync(new StartStreamArgs("pod-name", cameraId, rtspUrl, "h265")).Wait();
        var session = new StreamingSession(cameraId, "wss://localhost:3000/media-soup", "pod-name", clock.GetCurrentInstant());
        return session;
    }
    
}