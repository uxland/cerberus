using Cerberus.Surveillance.Features.Features.Round.List;
using Cerberus.Surveillance.Features.Features.Run.Create;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Schedule;

internal static class Factories
{
    public static ScheduledRun CreateScheduledRun(this SurveillanceRoundSummary round, Instant plannedAt)
    {
        var id = round.SurveillanceRunId(plannedAt);
        return new ScheduledRun(
            id,
            round.Id,
            round.Description ?? string.Empty,
            plannedAt,
            RunStatus.Pending
        );
    }
}