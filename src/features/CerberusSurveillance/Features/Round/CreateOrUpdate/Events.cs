using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate;

public record SurveillanceRoundCreated(
    string Id,
    RoundSettings Settings
) : IDomainEvent;

public record SurveillanceRoundUpdated(
    string Id,
    RoundSettings Settings
) : IDomainEvent;

public record SurveillanceRoundExecutionRecurrencePatternChanged(
    string Id,
    string PreviousRecurrencePattern,
    string NewRecurrencePattern
) : IDomainEvent;