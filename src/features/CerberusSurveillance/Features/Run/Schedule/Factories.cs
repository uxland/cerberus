using Cerberus.Surveillance.Features.Features.Round;
using Cerberus.Surveillance.Features.Features.Run.Create;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Schedule;

internal static class Factories
{
    public static ScheduledRun CreateScheduledRun(this SurveillanceRound round, DateTimeOffset at)
    {
        var plannedAt = Instant.FromDateTimeOffset(at);
        var id = round.SurveillanceRunId(plannedAt);
       return  new ScheduledRun(
            Id: id,
            RoundId: round.Id,
            Description: round.Description ?? string.Empty,
            PlannedAt:  plannedAt,
            Status: RunStatus.Pending
        );
    }
}