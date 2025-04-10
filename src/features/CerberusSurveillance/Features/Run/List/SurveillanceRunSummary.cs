using Cerberus.BackOffice.Features.OrganizationalStructure.Location;
using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Round.List;
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
    Instant EndTime,
    Instant PlannedAt,
    int TotalAnomalies,
    int InspectionWithAnomalies
) : IEntity
{
    public static SurveillanceRunSummary CreateSurveillanceRunSummary(SurveillanceRun run,
        SurveillanceRoundSummary round, Location location) => new SurveillanceRunSummary(
        run.Id,
        run.RootLocationId,
        location.Description,
        run.RoundId,
        round.Description,
        run.EndedBy ?? string.Empty,
        run.StartedAt.GetValueOrDefault(),
        run.EndedAt.GetValueOrDefault(),
        run.PlannedAt,
        run.InspectionRuns.SelectMany(x => x.OperationRun.Answers).Count(x => x.Answer?.IsAnomalous ?? false),
        run.InspectionRuns.Count(x => x.OperationRun.Answers.Any(y => y.Answer?.IsAnomalous ?? false))
    );
}