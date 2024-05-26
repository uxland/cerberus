using Cerverus.Core.Domain;
using Cerverus.Features.Features.OrganizationalStructure.Camera;

namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

public record CaptureCameraSnapshots(string LocationId): ICommand;

public record CaptureCameraSnapshot(string CameraId) : ICommand
{
    public static CaptureCameraSnapshot Create(string cameraId) => new(cameraId);
}