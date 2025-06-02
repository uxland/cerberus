using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerberus.Surveillance.Features.Features.Operation;
using Cerberus.Surveillance.Features.Features.Round;
using Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate;
using Cerberus.Surveillance.Features.Features.Round.Get;
using Marten;
using Marten.Events;
using Marten.Events.Aggregation;

namespace Cerberus.Surveillance.Persistence.Projections;

public class SurveillanceRoundDetailProjection : SingleStreamProjection<SurveillanceRoundDetail>
{
    public Task<SurveillanceRoundDetail> Create(IEvent<SurveillanceRoundCreated> @event, IQuerySession querySession)
    {
        var createdEvent = @event.Data;
        return CreateSurveillanceRoundDetail(querySession, @event.StreamKey!, createdEvent.Settings);
    }

    public Task<SurveillanceRoundDetail> Apply(SurveillanceRoundDetail _, IEvent<SurveillanceRoundUpdated> @event, IQuerySession querySession)
    {
        var updateEvent = @event.Data;
        return CreateSurveillanceRoundDetail(querySession, @event.StreamKey!, updateEvent.Settings);
    }

    private async Task<SurveillanceRoundDetail> CreateSurveillanceRoundDetail(IQuerySession querySession, string id,
        RoundSettings settings)
    {
        var inspections = await Task.WhenAll(settings.Inspections.Select(i => CreateInspectionDetails(querySession, i)));
        return new SurveillanceRoundDetail(
            Id: id,
            RootLocationId: settings.RootLocationId,
            Description: settings.Description,
            Inspections: inspections.ToList(),
            ExecutionRecurrencePattern: settings.CronExpression,
            AssignedTo: settings.AssignedTo,
            EstimatedDuration: settings.EstimatedDuration,
            DeferredExecution: settings.DeferredExecution
        );
    }
    private async Task<InspectionDetail> CreateInspectionDetails(IQuerySession querySession,
        Inspection inspection)
    {
        var operationTask = querySession.LoadAsync<SurveillanceOperation>(inspection.OperationId);
        var camera = await querySession.LoadAsync<Camera>(inspection.CameraId);
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