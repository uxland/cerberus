namespace Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate;

public record RoundSettings(
    string RootLocationId,
    string Description,
    string CronExpression,
    int? EstimatedDuration,
    string? AssignedTo,
    bool DeferredExecution,
    int? ClipDuration,
    IEnumerable<Inspection> Inspections
);