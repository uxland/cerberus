using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Start;

public record SurveillanceRunStarted(string RunId, string By, Instant At) : IDomainEvent;