using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Round;
using Cerberus.Surveillance.Features.Features.Round.List;
using NodaTime;
using NodaTime.Extensions;
using Quartz;

namespace Cerberus.Surveillance.Features.Features.Run.Schedule;

public static class Handler
{
    public static async Task<List<ScheduledRun>> Handle(GetUserSchedule query, IReadModelQueryProvider queryProvider, IUserContextProvider userContextProvider)
    {
        var allDayRunsTask = queryProvider.GetAllDayRuns(userContextProvider.CurrentUser, query);
        var runs = await queryProvider.GetTodayPerformedRuns(query);
        var allDayRuns = await allDayRunsTask;
        return allDayRuns.Select(x =>
        {
            var run = runs.SingleOrDefault(r => r.Id == x.Id);
            return x.Merge(run);
        }).ToList();

    }


    private static async Task<IEnumerable<SurveillanceRun>> GetTodayPerformedRuns(this IReadModelQueryProvider queryProvider, GetUserSchedule query)
    {
        var spec = SurveillanceRunSpecifications.ByPlannedAt(query.Day, query.Zone);
        var runs = await queryProvider.List(spec);
        return runs;
    }
    
    private static async Task<IEnumerable<ScheduledRun>> GetAllDayRuns(this IReadModelQueryProvider queryProvider, User user, GetUserSchedule query)
    {
        var rounds = await queryProvider.List<SurveillanceRoundSummary>(SurveillanceRoundSummarySpecifications.ByAssignedTo(user.MemberOf));
        return rounds.SelectMany(x => x.GetPlannedRunsForRound(query));
    }

    private static List<ScheduledRun> GetPlannedRunsForRound(this SurveillanceRoundSummary round, GetUserSchedule query)
    {
        var timeZone = query.Zone;
        var today = query.Day.InZone(timeZone).Date;
        var expression = new CronExpression(round.CronExpression.SanitizeForQuartz());
        var endOfDay = today.PlusDays(1).AtStartOfDayInZone(timeZone).ToInstant(); //Instant.FromUtc(today.PlusDays(1).AtStartOfDayInZone(timeZone).ToInstant()) today.PlusDays(1).AtStartOfDayInZone(timeZone).ToDateTimeOffset();
        var start = today.AtStartOfDayInZone(timeZone).ToDateTimeOffset();
        var nextTime = expression.GetNextValidTimeAfter(start);
        var result = new List<ScheduledRun>();
        var nexInstant = nextTime.ToInstant(timeZone);
        while (nexInstant != null && nexInstant.Value <= endOfDay)
        {
            result.Add(round.CreateScheduledRun(nexInstant.Value));
            nextTime = expression.GetNextValidTimeAfter(nextTime.Value);
            nexInstant = nextTime.ToInstant(timeZone);
        }
        return result;
    }

    private static Instant? ToInstant(this DateTimeOffset? dateTimeOffset, DateTimeZone timeZone)
    {
        if(dateTimeOffset == null)
            return null;
        var instant = Instant.FromDateTimeOffset(dateTimeOffset.Value);
        var zonedDateTime = instant.InZone(timeZone);
        var adjustedZonedDateTime = zonedDateTime.Date.At(new LocalTime(dateTimeOffset.Value.Hour, dateTimeOffset.Value.Minute, dateTimeOffset.Value.Second)).InZoneStrictly(timeZone);
        return adjustedZonedDateTime.ToInstant();
    }
    private static string SanitizeForQuartz(this string cron)
    {
        var parts = cron.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);

        if (parts.Length == 5)
            parts = new[] { "0" }.Concat(parts).ToArray();

        if (parts.Length != 6)
            throw new FormatException("Expected a 6-part Quartz cron expression");

        // Fix DOM/DOW ambiguity: if both are "*", set DOM to "?"
        if (parts[3] != "?" && parts[5] != "?")
            parts[3] = "?"; // default: prioritize day-of-week

        return string.Join(" ", parts);
    }
}