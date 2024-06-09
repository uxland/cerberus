using Cerverus.Core.Domain;

namespace Cerverus.BackOffice.Features.Captures.CaptureSnapshots;

public record SnapshotCaptured(
    
    CaptureSettings Settings
    ): IDomainEvent;