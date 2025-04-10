using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Release;

public record SurveillanceRunReleased(
    Instant At,
    string By
    ): IDomainEvent;