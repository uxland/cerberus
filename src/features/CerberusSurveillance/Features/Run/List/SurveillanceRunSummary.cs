using Cerberus.BackOffice.Features.OrganizationalStructure.Location;
using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Round;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.List;

public record SurveillanceRunSummary(
    string Id,
    string LocationId,
    string LocationDescription,
    string RoundId,
    string RoundDescription,
    string Performer,
    Instant StartTime,
    Instant EndTime
) : IEntity
{
    public SurveillanceRunSummary(SurveillanceRun run, SurveillanceRound round, Location location): this(
        run.Id,
        run.RootLocationId,
        location.Description,
        run.RoundId,
        round.Description ?? string.Empty,
        run.EndedBy ?? string.Empty,
        run.StartedAt.GetValueOrDefault(),
        run.EndedAt.GetValueOrDefault()
    )
    {
    }
}