using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Xabe.FFmpeg;

namespace Cerberus.Core.XabeFFMpegClient.ConversionBuilders;

public class DurationBuilder : IConversionBuilderStep
{
    public Task<IConversion> Handle(IConversion conversion, CaptureSnapshotArguments captureSnapshotArguments)
    {
        return captureSnapshotArguments.SecondsToCapture.HasValue ?
           Task.FromResult(conversion.AddParameter($"-t {captureSnapshotArguments.SecondsToCapture}")):
           Task.FromResult(conversion.AddParameter($"-frames:v {captureSnapshotArguments.FramesToCapture.GetValueOrDefault(1)}"));
    }
}