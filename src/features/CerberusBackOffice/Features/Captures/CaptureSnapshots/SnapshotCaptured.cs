using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.Captures.CaptureSnapshots;

public record SnapshotCaptured(
    
    CaptureSettings Settings
    ): IDomainEvent;