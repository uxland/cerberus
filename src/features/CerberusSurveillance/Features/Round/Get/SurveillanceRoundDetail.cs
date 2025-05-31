using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate;

namespace Cerberus.Surveillance.Features.Features.Round.Get;

public record SurveillanceRoundDetail(string Id, string Description, string RootLocationId, string ExecutionRecurrencePattern, int? EstimatedDuration, string? AssignedTo, DeferredSettings? DeferredExecution, List<InspectionDetail> Inspections): IEntity;