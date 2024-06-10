namespace Cerberus.BackOffice.Features.Captures.CaptureSnapshots;

public interface ISnapshotCapturer
{
    Task<(CaptureError? Error, string? SnapshotRawPath, string? SnapshotThumbnailPath, string? SnapshotPath)> CaptureSnapshot(CaptureSnapshotArguments arguments, CancellationToken cancellationToken = default);
}

public record CaptureSnapshotArguments(
    string Address,
    string Username,
    string Password,
    string CameraPath,
    uint FramesToCapture = 1
    );
public class SnapshotCaptureSettings
{
    public string FolderRoot { get; set; }
}