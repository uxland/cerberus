using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Cerberus.Core.XabeFFMpegClient.ConversionBuilders;
using Microsoft.Extensions.Logging;
using Xabe.FFmpeg;

namespace Cerberus.Core.XabeFFMpegClient.CaptureMiddlewares;

public class FileBuilder(ILogger<FileBuilder> logger) : IConversionBuilderStep
{
    public async Task<IConversion> Handle(IConversion conversion, CaptureSnapshotArguments captureSnapshotArguments)
    {
        if (IsFile(captureSnapshotArguments))
        {
            var startingPoint = await GetStartingPoint(captureSnapshotArguments);
            conversion = conversion.AddParameter($"-ss {startingPoint}");
        }

        return conversion;
    }
    
    private static bool IsFile(CaptureSnapshotArguments arguments)
    {
        return new Uri(arguments.Address).Scheme == "file";
    }
    
    private async Task<int> GetStartingPoint(CaptureSnapshotArguments arguments)
    {
        try
        {
            var mediaInfo = await FFmpeg.GetMediaInfo(arguments.Address);
            var secondsToCapture = arguments.SecondsToCapture ?? Convert.ToUInt32((Convert.ToDouble(arguments.FramesToCapture.GetValueOrDefault(1)) / mediaInfo.VideoStreams.First().Framerate));
            var seconds = Convert.ToInt32(mediaInfo.Duration.TotalSeconds - secondsToCapture);
            return new Random().Next(0, seconds);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Couldn't get file media info from {File}", arguments.Address);
            return 0;
        }
        
    }

    
}