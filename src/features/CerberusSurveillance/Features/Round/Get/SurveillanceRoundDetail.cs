using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Round.Get;

public record SurveillanceRoundDetail(string Id, string Description, string RootLocationId, string ExecutionRecurrencePattern, int? EstimatedDuration, string? AssignedTo, bool DeferredExecution, int? ClipDuration, List<InspectionDetail> Inspections): IEntity;