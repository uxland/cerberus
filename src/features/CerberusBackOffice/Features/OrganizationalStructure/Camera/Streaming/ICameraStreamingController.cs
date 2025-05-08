using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.Streaming;

public record StartStreamArgs(string Pod, string CameraId, string RtspUrl, string Encoding);
public record StopStreamArgs(string Pod, string CameraId);
public interface ICameraStreamingController
{
    Task StartStreamAsync(StartStreamArgs args);
    Task StopStreamAsync(StopStreamArgs args);
}

internal class CameraStreamingController(HttpClient httpClient, ILogger<CameraStreamingController> logger) : ICameraStreamingController
{
    private static JsonSerializerOptions options = new JsonSerializerOptions
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };
    public async Task StartStreamAsync(StartStreamArgs args)
    {
        logger.LogInformation("Starting stream for camera {CameraId} with RTSP URL {RtspUrl}", args.CameraId, args.RtspUrl);
        await httpClient.PutAsync($"api/streams/{args.CameraId}/start", new StringContent(JsonSerializer.Serialize(args, options), Encoding.UTF8, "application/json"));
        
    }

    public  async Task StopStreamAsync(StopStreamArgs args)
    {
        logger.LogInformation("Stopping stream for camera {CameraId}", args.CameraId);
        await httpClient.PutAsync($"api/streams/{args.CameraId}/stop", new StringContent(JsonSerializer.Serialize(args, options), Encoding.UTF8, "application/json"));
        
    }
}