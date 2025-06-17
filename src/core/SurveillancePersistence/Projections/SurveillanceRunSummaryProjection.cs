using Cerberus.BackOffice.Features.OrganizationalStructure.Location;
using Cerberus.Surveillance.Features.Features.Round.List;
using Cerberus.Surveillance.Features.Features.Run;
using Cerberus.Surveillance.Features.Features.Run.List;
using Cerberus.Surveillance.Features.Features.Run.Release;
using JasperFx.Events;
using Marten;
using Marten.Events;
using Marten.Events.Aggregation;

namespace Cerberus.Surveillance.Persistence.Projections;

public class SurveillanceRunSummaryProjection: SingleStreamProjection<SurveillanceRunSummary, string>
{
    public Task<SurveillanceRunSummary> Create(IEvent<SurveillanceRunReleased> @event, IQuerySession querySession)
    {
        var startedEvent = @event.Data;
        return CreateSurveillanceRunSummary(querySession, @event.StreamKey!, startedEvent);
    }
    
    private static async Task<SurveillanceRunSummary> CreateSurveillanceRunSummary(IQuerySession querySession, string id, SurveillanceRunReleased releasedEvent)
    {
        var run = await querySession.LoadAsync<SurveillanceRun>(id);
        var round = await querySession.LoadAsync<SurveillanceRoundSummary>(run!.RoundId);
        var location = await querySession.LoadAsync<Location>(run.RootLocationId);
        return SurveillanceRunSummary.CreateSurveillanceRunSummary(
           run: run ?? throw new InvalidOperationException(),
           round: round ?? throw new InvalidOperationException(),
           location: location ?? throw new InvalidOperationException()
        );
    }
}