using System.Drawing;
using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Xabe.FFmpeg;

namespace Cerberus.Core.XabeFFMpegClient.ConversionBuilders;

public class RstpBuilder : IConversionBuilderStep
{
    public string SortKey { get; } = "002";

    public Task<IConversion> Handle(IConversion conversion, CaptureSnapshotArguments captureSnapshotArguments)
    {
        if(IsRstp(captureSnapshotArguments))
            conversion = conversion.AddParameter("-rtsp_transport tcp");
        return Task.FromResult(conversion);
    }
    
    private static bool IsRstp(CaptureSnapshotArguments arguments)
    {
        return new Uri(arguments.Address).Scheme == "rtsp";
    }
    
}