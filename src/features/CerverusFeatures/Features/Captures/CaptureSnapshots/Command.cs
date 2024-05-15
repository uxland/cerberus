using Cerverus.Core.Domain;

namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

public record CaptureCameraSnapshots(string LocationId): ICommand;