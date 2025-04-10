using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Claim;

public record SurveillanceRunClaimed(string Id, Instant At, string By): IDomainEvent;