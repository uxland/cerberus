using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Xabe.FFmpeg;

namespace Cerberus.Core.XabeFFMpegClient.ConversionBuilders;

public interface IConversionBuilderStep
{
    string SortKey { get; }
    Task<IConversion> Handle(IConversion conversion, CaptureSnapshotArguments captureSnapshotArguments);
}