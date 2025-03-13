using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.SetInspection;

public record RunsInspectionSet(
    string InspectionId,
    string By,
    Instant? StartedAt,
    Instant EndedAt,
    OperationRun OperationRun
    ): IDomainEvent;