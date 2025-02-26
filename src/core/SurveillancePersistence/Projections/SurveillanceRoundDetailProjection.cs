using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerberus.Surveillance.Features.Features.Operation;
using Cerberus.Surveillance.Features.Features.Round;
using Cerberus.Surveillance.Features.Features.Round.Create;
using Cerberus.Surveillance.Features.Features.Round.Get;
using Marten;
using Marten.Events;
using Marten.Events.Aggregation;

namespace Cerberus.Surveillance.Persistence.Projections;

public class SurveillanceRoundDetailProjection: SingleStreamProjection<SurveillanceRoundDetail>
{
    public async Task<SurveillanceRoundDetail> Create(IEvent<SurveillanceRoundCreated> @event, IQuerySession querySession)
    {
        var createdEvent = @event.Data;
        var inspections = await Task.WhenAll(createdEvent.Inspections.Select(i => CreateInspectionDetails(querySession, i)));
        return new SurveillanceRoundDetail(
            Id: @event.StreamKey!,
            RootLocationId: createdEvent.RootLocationId,
            Description: createdEvent.Description,
            Inspections: inspections.ToList(),
            ExecutionRecurrencePattern: createdEvent.CronExpression,
            AssignedTo: createdEvent.AssignedTo,
            EstimatedDuration: createdEvent.EstimatedDuration
        );        
    }


    private async Task<InspectionDetail> CreateInspectionDetails(IQuerySession querySession,
        Inspection inspection)
    {
        var operationTask = querySession.LoadAsync<SurveillanceOperation>(inspection.OperationId);
        var camera =await  querySession.LoadAsync<Camera>(inspection.CameraId);
        var operation = await operationTask;
        return new InspectionDetail(
            inspection.Id,
            inspection.CameraId,
            camera?.Description ?? string.Empty,
            inspection.OperationId,
            operation?.Description ?? string.Empty,
            inspection.Order,
            camera?.AdminSettings.IpAddress ?? string.Empty);
    }
}