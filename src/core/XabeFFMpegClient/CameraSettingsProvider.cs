using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetMediaInfo;
using Microsoft.Extensions.Logging;
using Xabe.FFmpeg;

namespace Cerberus.Core.XabeFFMpegClient;

public class CameraSettingsProvider(ILogger<CameraSettingsProvider> logger): ICameraSettingsProvider
{
    public async Task<VideoStreamMediaInfo> GetCameraSettings(CameraConnectionSettings connectionSettings, CancellationToken cancellationToken = default)
    {
        using var cancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        var task = Task.Run(() => GetCodec(connectionSettings, cancellationTokenSource.Token),
            cancellationTokenSource.Token);
        try
        {
            if(await Task.WhenAny(task, Task.Delay(TimeSpan.FromSeconds(15), cancellationTokenSource.Token)) == task)
            {
                await cancellationTokenSource.CancelAsync();
                return new VideoStreamMediaInfo(await task);
            }

            await cancellationTokenSource.CancelAsync();
            throw new TimeoutException("Timeout while retrieving camera codec");
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error  while retrieving camera codec");
            throw;
        }

    }

    private async Task<string> GetCodec(CameraConnectionSettings connectionSettings, CancellationToken cancellation)
    { 
        string[] args =
        [
            "-rtsp_transport tcp",
            "-v error",
            "-select_streams v:0",
            "-show_entries stream=codec_name",
            "-of csv=p=0",
            $"\"{connectionSettings.GetConnectionString()}\""
            
        ];
        var codec = (await Probe.New().Start(string.Join(" ", args), cancellation) ?? "").Trim();
        return codec == "hevc" ? "h265" : codec;

    }

}