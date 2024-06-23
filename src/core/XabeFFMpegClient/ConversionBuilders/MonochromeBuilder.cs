using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Xabe.FFmpeg;

namespace Cerberus.Core.XabeFFMpegClient.ConversionBuilders;

public class MonochromeBuilder : IConversionBuilderStep
{
    public Task<IConversion> Handle(IConversion conversion, CaptureSnapshotArguments captureSnapshotArguments)
    {
        return Task.FromResult(conversion.AddParameter("-vf format=gray"));
    }
}