using Cerverus.Core.Domain;

namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

public record SnapshotCaptured(
    
    CaptureSettings Settings
    ): IDomainEvent;