using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.Captures.CaptureSnapshots;

public record CaptureCameraSnapshots(string LocationId): ICommand;

public record CaptureCameraSnapshot(string CameraId) : ICommand
{
    public static CaptureCameraSnapshot Create(string cameraId) => new(cameraId);
}