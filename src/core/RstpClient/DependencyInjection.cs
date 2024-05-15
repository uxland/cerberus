using Cerverus.Features.Features.Captures.CaptureSnapshots;
using FFmpeg.AutoGen;
using Microsoft.Extensions.DependencyInjection;

namespace Cerverus.Core.RstpClient;

public static class DependencyInjection
{
    public static IServiceCollection UseRstpClient(this IServiceCollection services)
    {
        SetupCodecs();
        return services.AddTransient<ISnapshotCatcher, RstpClientImplementation>();
    }

    public static void SetupCodecs()
    {
        FFmpegBinariesHelper.RegisterFFmpegBinaries();
        FFmpeg.AutoGen.DynamicallyLoadedBindings.Initialize();
        ffmpeg.avdevice_register_all();
        
    }
}