namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

public interface ISnapshotCatcher
{
    Task<(byte[]? Buffer, CaptureError? Error)> CaptureSnapshot(CaptureSnapshotArguments arguments, CancellationToken cancellationToken = default);
}

public record CaptureSnapshotArguments(
    string Address,
    string Username,
    string Password,
    uint FramesToCapture = 1
    );