using Cerberus.Signaling.Api.Entities;
using System.Collections.Concurrent;

namespace Cerberus.Signaling.Api.Services;

public class StreamManager(CameraConfigService cameraConfigService, ILogger<CameraStream> logger)
{
    private record StreamEntry(CameraStream Stream, HashSet<string> Clients, bool IsRunning);

    private readonly ConcurrentDictionary<string, StreamEntry> _streams = new();

    public async Task<string> HandleOfferAsync(string cameraId, string connectionId, string sdpOffer)
    {
        var entry = _streams.GetOrAdd(cameraId, _ =>
        {
            var config = cameraConfigService.GetCameraConfig(cameraId);
            var stream = new CameraStream(logger);
            return new StreamEntry(stream, new HashSet<string>(), false);
        });

        lock (entry.Clients)
        {
            entry.Clients.Add(connectionId);
        }

        if (!entry.IsRunning)
        {
            await entry.Stream.StartAsync(cameraId);
            _streams[cameraId] = entry with { IsRunning = true }; // C# 9 record "with" syntax
        }

        await entry.Stream.SendOfferAsync(sdpOffer);
        return "Ok";
    }

    public async Task HandleIceCandidate(string cameraId, string connectionId, string candidate)
    {
        if (_streams.TryGetValue(cameraId, out var entry))
        {
            await entry.Stream.SendIceCandidateAsync(candidate);
        }
    }

    public void RemoveClient(string connectionId)
    {
        foreach (var (cameraId, entry) in _streams)
        {
            lock (entry.Clients)
            {
                entry.Clients.Remove(connectionId);

                if (entry.Clients.Count == 0)
                {
                    // Stop the worker process manually
                    entry.Stream.Kill();
                    _streams.TryRemove(cameraId, out _);
                }
            }
        }
    }
}