using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Xabe.FFmpeg;

namespace Cerberus.Core.XabeFFMpegClient.ConversionBuilders;

public class ConversionBuilder(IEnumerable<IConversionBuilderStep> builderSteps)
{
    public async Task<IConversion> Build(IConversion conversion, CaptureSnapshotArguments captureSnapshotArguments)
    {
        foreach (var builderStep in builderSteps.Reverse())
            conversion = await builderStep.Handle(conversion, captureSnapshotArguments);
        return conversion;
    }
}