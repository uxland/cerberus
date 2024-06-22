using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Microsoft.Extensions.DependencyInjection;
using Xabe.FFmpeg;
using Xabe.FFmpeg.Downloader;

namespace Cerberus.Core.XabeFFMpegClient;

public static class Bootstrapper
{
    public static IServiceCollection BootstrapXabeFFMpegClient(this IServiceCollection services)
    {
        if (!IsExecutableInPath("ffmpeg"))
        {
            FFmpegDownloader.GetLatestVersion(FFmpegVersion.Official).ConfigureAwait(false).GetAwaiter().GetResult();
            FFmpeg.SetExecutablesPath(Environment.CurrentDirectory);
        }

        return services.AddSingleton<ISnapshotCapturer, SnapshotCapturer>();
    }

    public static bool IsExecutableInPath(string executableName)
    {
        var paths = (Environment.GetEnvironmentVariable("PATH") ?? string.Empty).Split(Path.PathSeparator);
        return paths.Any(path => File.Exists(Path.Combine(path, executableName)));
    }
}