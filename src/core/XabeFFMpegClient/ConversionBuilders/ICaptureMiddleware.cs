using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Xabe.FFmpeg;

namespace Cerberus.Core.XabeFFMpegClient.ConversionBuilders;

public interface IConversionBuilderStep
{
    Task<IConversion> Handle(IConversion conversion, CaptureSnapshotArguments captureSnapshotArguments);
}