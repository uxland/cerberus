using Cerberus.BackOffice.Features.OrganizationalStructure.Location;
using Cerberus.Surveillance.Features.Features.Round;
using Cerberus.Surveillance.Features.Features.Run;
using Cerberus.Surveillance.Features.Features.Run.List;
using Cerberus.Surveillance.Features.Features.Run.Release;
using Marten;
using Marten.Events;
using Marten.Events.Aggregation;

namespace Cerberus.Surveillance.Persistence.Projections;

public class SurveillanceRunSummaryProjection: SingleStreamProjection<SurveillanceRunSummary>
{
    public Task<SurveillanceRunSummary> Create(IEvent<SurveillanceRunReleased> @event, IQuerySession querySession)
    {
        var startedEvent = @event.Data;
        return CreateSurveillanceRunSummary(querySession, @event.StreamKey!, startedEvent);
    }
    
    private static async Task<SurveillanceRunSummary> CreateSurveillanceRunSummary(IQuerySession querySession, string id, SurveillanceRunReleased releasedEvent)
    {
        var run = await querySession.LoadAsync<SurveillanceRun>(id);
        
        return new SurveillanceRunSummary(
           run: run ?? throw new InvalidOperationException(),
           round: await querySession.LoadAsync<SurveillanceRound>(run!.RoundId)! ?? throw new InvalidOperationException(),
           location: await querySession.LoadAsync<Location>(run.RootLocationId)! ?? throw new InvalidOperationException()
        );
    }
}