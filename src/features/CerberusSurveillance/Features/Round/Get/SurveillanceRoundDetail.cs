using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Round.Get;

public record SurveillanceRoundDetail(string Id, string Description, string RootLocationId, string ExecutionRecurrencePattern, int? EstimatedDuration, string? AssignedTo, List<InspectionDetail> Inspections): IEntity;