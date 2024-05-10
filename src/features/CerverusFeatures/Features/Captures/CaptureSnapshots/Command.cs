using Cerverus.Core.Domain;

namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

public record CaptureCameraSnapshot(string Id): ICommand;