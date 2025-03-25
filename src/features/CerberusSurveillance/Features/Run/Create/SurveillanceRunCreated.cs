using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Create;

public record SurveillanceRunCreated(
    string Id,
    string RoundId,
    string RootLocationId,
    string? AssignedGroupId,
    IEnumerable<InspectionRun> InspectionRuns,
    RunStatus Status,
    Instant PlannedAt
) : IDomainEvent;