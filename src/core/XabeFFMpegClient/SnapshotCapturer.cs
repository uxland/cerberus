using Cerberus.BackOffice.Features.Captures;
using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Cerberus.Core.XabeFFMpegClient.ConversionBuilders;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NodaTime;
using Xabe.FFmpeg;

namespace Cerberus.Core.XabeFFMpegClient;

public class SnapshotCapturer(
    IOptions<SnapshotCaptureSettings> captureSettings,
    ILogger<SnapshotCapturer> logger,
    ConversionBuilder captureMiddleware)
    : ISnapshotCapturer
{
    private readonly string _rootPath = captureSettings.Value.FolderRoot;

    public async
        Task<(CaptureError? Error, string? SnapshotRawPath, string? SnapshotThumbnailPath)>
        CaptureSnapshot(CaptureSnapshotArguments arguments, CancellationToken cancellationToken = default)
    {
        var snapshotRelativePath = GetCameraDirectory(arguments.CameraPath);
        var rawPath = Path.Combine(snapshotRelativePath, "snapshot.bmp");
        var thumbnailPath = Path.Combine(snapshotRelativePath, "snapshot_thumbnail.jpg");
        try
        {
            await CaptureFrameWithTimeout(Path.Combine(_rootPath, rawPath),
                arguments,
                TimeSpan.FromSeconds(155), cancellationToken);
            await CreateThumbnail(Path.Combine(_rootPath, rawPath), Path.Combine(_rootPath, thumbnailPath));
        }
        catch (HttpRequestException e) when (e.Message.Contains("401") || e.Message.Contains("403"))
        {
            return (new CaptureError("Unauthorized", CaptureErrorType.AuthenticationError), null, null);
        }
        catch (HttpRequestException e) when (e.Message.Contains("404"))
        {
            return (new CaptureError(e.Message, CaptureErrorType.ConnectionError), null, null);
        }
        catch (HttpRequestException e) when (e.Message.Contains("Network"))
        {
            return (new CaptureError(e.Message, CaptureErrorType.ConnectionError), null, null);
        }
        catch (OperationCanceledException e)
        {
            return (new CaptureError(e.Message, CaptureErrorType.ConnectionTimeout), null, null);
        }
        catch (Exception e)
        {
            return (new CaptureError(e.Message, CaptureErrorType.UnknownError), null, null);
        }

        return (null, rawPath, thumbnailPath);
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

    private async Task CaptureFrameWithTimeout(string outputFilePath, CaptureSnapshotArguments arguments, TimeSpan timeout,
        CancellationToken cancellationToken = default)
    {
        using (var cancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken))
        {
            logger.LogInformation("Starting capture of frame from {StreamUrl} with a timeout of {TimeoutTotalSeconds} seconds", arguments.Address, timeout.TotalSeconds);

            var captureTask = Task.Run(() => CaptureFrame(outputFilePath, arguments, cancellationTokenSource.Token),
                cancellationTokenSource.Token);

            try
            {
                if (await Task.WhenAny(captureTask, Task.Delay(timeout, cancellationTokenSource.Token)) == captureTask)
                {
                    // FFmpeg task completed within timeout
                    await cancellationTokenSource.CancelAsync(); // Cancel the delay task
                    await captureTask; // Ensure any exceptions/cancellations are rethrown
                    logger.LogInformation("Capture completed successfully");
                }
                else
                {
                    // Timeout occurred
                    await cancellationTokenSource.CancelAsync();
                    logger.LogWarning("Capture timed out");
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

    private async Task CaptureFrame(string outputFilePath, CaptureSnapshotArguments arguments, CancellationToken cancellationToken)
    {
        var conversion = FFmpeg.Conversions.New()
            .AddParameter($"-i {arguments.Address}");
        conversion = await captureMiddleware.Build(conversion, arguments);
        conversion.SetOutput(outputFilePath);
        using var process = conversion.Start(cancellationToken);
        await process;
    }

    private string GetCameraDirectory(string cameraPath)
    {
        var pathSegments = cameraPath.Split(">");
        var cameraRelativePath = Path.Combine(pathSegments);
        var snapshotRelativePath = Path.Combine(cameraRelativePath,
            $"{Instant.FromDateTimeUtc(DateTime.UtcNow).ToUnixTimeMilliseconds()}");
        var directoryInfo = new DirectoryInfo(Path.Combine(_rootPath, snapshotRelativePath));
        if (!directoryInfo.Exists)
            directoryInfo.Create();
        return snapshotRelativePath;
    }
}