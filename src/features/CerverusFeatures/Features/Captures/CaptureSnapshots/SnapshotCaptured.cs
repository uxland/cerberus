using Cerverus.Core.Domain;
using MediatR;

namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

public record SnapshotCaptured(
    CaptureSettings Settings
    ): IDomainEvent;