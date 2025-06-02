namespace Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate;

public record RoundSettings(
    string RootLocationId,
    string Description,
    string CronExpression,
    int? EstimatedDuration,
    string? AssignedTo,
    DeferredSettings? DeferredExecution,
    IEnumerable<Inspection> Inspections
);

public record DeferredSettings(int ClipDurationInSeconds);