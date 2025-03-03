using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Run.Create;

public record SurveillanceRunCreated(
    string Id,
    string RoundId,
    string RootLocationId,
    string? AssignedGroupId,
    IEnumerable<InspectionRun> InspectionRuns,
    RunStatus Status
) : IDomainEvent;