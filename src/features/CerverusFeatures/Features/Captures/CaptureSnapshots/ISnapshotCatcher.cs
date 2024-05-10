namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

public interface ISnapshotCatcher
{
    Task<(Stream? stream, CaptureError? Error)> CaptureSnapshot(string address, string username, string password, CancellationToken cancellationToken = default);
}