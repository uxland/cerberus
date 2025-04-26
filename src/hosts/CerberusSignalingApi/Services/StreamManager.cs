using Cerberus.Signaling.Api.Entities;

namespace Cerberus.Signaling.Api.Services;

using System.Collections.Concurrent;

public class StreamManager(CameraConfigService cameraConfigService)
{
    private readonly ConcurrentDictionary<string, CameraStream> _streams = new();

    public async Task<string> HandleOfferAsync(string cameraId, string connectionId, string sdpOffer)
    {
        var stream = _streams.GetOrAdd(cameraId, _ =>
        {
            var config = cameraConfigService.GetCameraConfig(cameraId);
            return new CameraStream(cameraId, config);
        });

        stream.AddClient(connectionId);
        if (!stream.IsRunning)
        {
            await stream.StartAsync();
        }

        return await stream.HandleOfferAsync(connectionId, sdpOffer);
    }

    public async Task HandleIceCandidate(string cameraId, string connectionId, string candidate)
    {
        if (_streams.TryGetValue(cameraId, out var stream))
        {
            await stream.HandleIceCandidate(connectionId, candidate);
        }
    }

    public void RemoveClient(string connectionId)
    {
        foreach (var kvp in _streams)
        {
            var cameraId = kvp.Key;
            var stream = kvp.Value;
            stream.RemoveClient(connectionId);

            if (!stream.HasClients)
            {
                stream.Stop();
                _streams.TryRemove(cameraId, out _);
            }
        }
    }
}