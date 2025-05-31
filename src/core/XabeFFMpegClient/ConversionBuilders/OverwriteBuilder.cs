using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Xabe.FFmpeg;

namespace Cerberus.Core.XabeFFMpegClient.ConversionBuilders;

public class OverwriteBuilder: IConversionBuilderStep
{
    public string SortKey => "001";
    public Task<IConversion> Handle(IConversion conversion, CaptureSnapshotArguments captureSnapshotArguments)
    {
        return Task.FromResult(conversion.SetOverwriteOutput(captureSnapshotArguments.OverwriteOutput));
    }
}