using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Xabe.FFmpeg;

namespace Cerberus.Core.XabeFFMpegClient.ConversionBuilders;

public class MonochromeBuilder : IConversionBuilderStep
{
    public string SortKey => "006";
    public Task<IConversion> Handle(IConversion conversion, CaptureSnapshotArguments captureSnapshotArguments)
    {
        return Task.FromResult(captureSnapshotArguments.Monochrome? conversion.AddParameter("-vf format=gray"): conversion);
    }
}