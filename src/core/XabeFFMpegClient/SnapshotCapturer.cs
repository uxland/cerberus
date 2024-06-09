using Cerverus.BackOffice.Features.Captures;
using Cerverus.BackOffice.Features.Captures.CaptureSnapshots;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NodaTime;
using Xabe.FFmpeg;

namespace Cerverus.Core.XabeFFMpegClient;

public class SnapshotCapturer(IOptions<SnapshotCaptureSettings> captureSettings, ILogger<SnapshotCapturer> logger): ISnapshotCapturer
{
    private readonly string _rootPath = captureSettings.Value.FolderRoot;
    public async Task<(CaptureError? Error, string? SnapshotRawPath, string? SnapshotThumbnailPath, string? SnapshotPath)> CaptureSnapshot(CaptureSnapshotArguments arguments, CancellationToken cancellationToken = default)
    {
        var snapshotRelativePath = GetCameraDirectory(arguments.CameraPath);
        var rawPath = Path.Combine(snapshotRelativePath, "snapshot.bmp");
        var thumbnailPath = Path.Combine(snapshotRelativePath, "snapshot_thumbnail.jpg");
        var snapshotPath = Path.Combine(snapshotRelativePath, "snapshot.jpg");
        try
        {
            await CaptureFrameWithTimeout(Path.Combine(_rootPath, rawPath),
                arguments.Address,
                TimeSpan.FromSeconds(5));
            await Task.WhenAll(
                ConvertToJpeg(Path.Combine(_rootPath, rawPath), Path.Combine(_rootPath, snapshotPath)),
                CreateThumbnail(Path.Combine(_rootPath, rawPath), Path.Combine(_rootPath, thumbnailPath))
            );
        }
        catch (HttpRequestException e) when (e.Message.Contains("401") || e.Message.Contains("403"))
        {
            return (new CaptureError("Unauthorized", CaptureErrorType.AuthenticationError), null, null, null);
        }
        catch (HttpRequestException e) when (e.Message.Contains("404"))
        {
            return (new CaptureError(e.Message, CaptureErrorType.ConnectionError), null, null, null);
        }
        catch (HttpRequestException e) when (e.Message.Contains("Network"))
        {
            return (new CaptureError(e.Message, CaptureErrorType.ConnectionError), null, null, null);
        }
        catch (OperationCanceledException e)
        {
            return (new CaptureError(e.Message, CaptureErrorType.ConnectionTimeout), null, null, null);
        }
        catch (Exception e)
        {
            return (new CaptureError(e.Message, CaptureErrorType.UnknownError), null, null, null);
        }
        return (null, rawPath, thumbnailPath, snapshotPath);
    }

    private async Task ConvertToJpeg(string inputPath, string outputPath)
    {
        try
        {
            var conversion = FFmpeg.Conversions.New()
                .AddParameter($"-i {inputPath}")
                .SetOutput(outputPath);
            await conversion.Start();
            
        }
        catch (Exception e)
        {
            logger.LogError("Error converting snapshot to jpeg: {Message}", e.Message);
            throw;
        }
    }

    private async Task CreateThumbnail(string inputPath, string outputPath)
    {
        try
        {
            var conversion = FFmpeg.Conversions.New()
                .AddParameter($"-i {inputPath}")
                .AddParameter("-vf scale=160:120")
                .SetOutput(outputPath);
            await conversion.Start();
        }
        catch (Exception e)
        {
            logger.LogError("Error creating thumbnail: {Message}", e.Message);
            throw;
        }
    }
    
    private async Task CaptureFrameWithTimeout(string outputFilePath, string streamUrl, TimeSpan timeout, CancellationToken cancellationToken = default)
    {
        using (var cancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken))
        {
            logger.LogInformation($"Starting capture of frame from {streamUrl} with a timeout of {timeout.TotalSeconds} seconds.");

            var captureTask = Task.Run(() => CaptureFrame(outputFilePath, streamUrl, cancellationTokenSource.Token), cancellationTokenSource.Token);

            try
            {
                if (await Task.WhenAny(captureTask, Task.Delay(timeout, cancellationTokenSource.Token)) == captureTask)
                {
                    // FFmpeg task completed within timeout
                    cancellationTokenSource.Cancel(); // Cancel the delay task
                    await captureTask; // Ensure any exceptions/cancellations are rethrown
                    logger.LogInformation("Capture completed successfully.");
                }
                else
                {
                    // Timeout occurred
                    cancellationTokenSource.Cancel();
                    logger.LogWarning("Capture timed out.");
                    throw new OperationCanceledException("The operation was canceled due to timeout.");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while capturing frame.");
                throw;
            }
        }
    }

    private static async Task CaptureFrame(string outputFilePath, string streamUrl, CancellationToken cancellationToken)
    {
        var capture = FFmpeg.Conversions.New()
            .AddParameter("-rtsp_transport tcp")
            .AddParameter($"-i {streamUrl}")
            .AddParameter("-frames:v 1")
            .SetOutput(outputFilePath);

        using var process = capture.Start(cancellationToken);
        await process;
    }
    private string GetCameraDirectory(string cameraPath)
    {
        var pathSegments = cameraPath.Split(">");
        var cameraRelativePath = Path.Combine(pathSegments);
        var snapshotRelativePath = Path.Combine(cameraRelativePath, $"{Instant.FromDateTimeUtc(DateTime.UtcNow).ToUnixTimeMilliseconds()}");
        var directoryInfo = new DirectoryInfo(Path.Combine(this._rootPath, snapshotRelativePath));
        if (!directoryInfo.Exists)
            directoryInfo.Create();
        return snapshotRelativePath;
    }
}