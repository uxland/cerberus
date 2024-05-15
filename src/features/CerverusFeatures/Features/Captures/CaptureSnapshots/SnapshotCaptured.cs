using MediatR;

namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

public record SnapshotCaptured(
    string cameraId,
    CaptureError? Error,
    string? SnapshotPath
    ): INotification;