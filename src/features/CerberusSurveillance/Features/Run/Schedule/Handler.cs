using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Round;
using NodaTime;
using Quartz;

namespace Cerberus.Surveillance.Features.Features.Run.Schedule;

public static class Handler
{
    public static async Task<List<ScheduledRun>> Handle(GetUserSchedule query, IReadModelQueryProvider queryProvider, IUserContextProvider userContextProvider)
    {
        var aux = userContextProvider.CurrentUser;
        var allDayRunsTask = queryProvider.GetAllDayRuns();
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
    
    private static async Task<IEnumerable<ScheduledRun>> GetAllDayRuns(this IReadModelQueryProvider queryProvider)
    {
        var rounds = await queryProvider.List<SurveillanceRound>();
        return rounds.SelectMany(x => x.GetPlannedRunsForRound());
    }

    private static List<ScheduledRun> GetPlannedRunsForRound(this SurveillanceRound round)
    {
        var timeZone = DateTimeZoneProviders.Tzdb.GetSystemDefault();
        var today = LocalDate.FromDateTime(DateTime.Today);
        var expression = new CronExpression(round.ExecutionRecurrencePattern);
        var endOfDay = today.PlusDays(1).AtStartOfDayInZone(timeZone).ToDateTimeOffset();
        var nextTime = expression.GetNextValidTimeAfter(endOfDay);
        var result = new List<ScheduledRun>();
        while (nextTime != null && nextTime <= endOfDay)
        {
            result.Add(round.CreateScheduledRun(nextTime.Value));
            nextTime = expression.GetNextValidTimeAfter(nextTime.Value);
        }
        return result;
    }
    
}