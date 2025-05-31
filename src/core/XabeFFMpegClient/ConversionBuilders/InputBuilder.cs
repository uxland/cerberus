using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Xabe.FFmpeg;

namespace Cerberus.Core.XabeFFMpegClient.ConversionBuilders;

public class InputBuilder : IConversionBuilderStep
{
    public string SortKey => "003";
    public Task<IConversion> Handle(IConversion conversion, CaptureSnapshotArguments captureSnapshotArguments)
    {
        return Task.FromResult(conversion.AddParameter($"-i {captureSnapshotArguments.Address}"));
    }
}