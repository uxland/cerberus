using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Schedule;

public record ScheduledRun(
    string Id,
    string RoundId,
    string Description,
    Instant PlannedAt,
    RunStatus Status,
    Instant? StartedAt = null,
    string? StartedBy = null,
    Instant? EndedAt = null,
    string? EndedBy = null)
{
    public ScheduledRun Merge(SurveillanceRun? run)
    {
        if (run == null || run.Id != this.Id) return this;
        return this with
        {
            StartedAt = run.StartedAt,
            StartedBy = run.StartedBy,
            EndedAt = run.EndedAt,
            EndedBy = run.EndedBy,
            Status = run.Status,
        };
    }
}