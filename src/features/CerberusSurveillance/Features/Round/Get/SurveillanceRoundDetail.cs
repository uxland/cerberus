using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Round.Get;

public record SurveillanceRoundDetail(string Id, string Description, string ExecutionRecurrencePattern, int? EstimatedDuration, string? AssignedTo, List<InspectionDetail> Inspections): IEntity
{
    
}

public record InspectionDetail(string Id, string CameraId, string CameraDescription, string OperationId, string OperationDescription, int Order, string? StreamingUrl);