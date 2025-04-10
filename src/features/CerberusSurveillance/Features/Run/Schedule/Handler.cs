using Cerberus.Core.Domain;
using Cerberus.Core.Domain.CronExpressions;
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
        return rounds.SelectMany(x => x.GetPlannedRunsForRound(query).ToList());
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
    
}