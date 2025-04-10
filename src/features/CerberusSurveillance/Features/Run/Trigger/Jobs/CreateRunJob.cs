using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Run.Create;
using NodaTime;
using NodaTime.Extensions;
using Quartz;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Run.Trigger.Jobs;

public class CreateRunJob(IReadModelQueryProvider queryProvider, IClock clock, IMessageBus messageBus) : IJob
{
    public const string JobKey = "Surveillance::CreateRunJob";

    public async Task Execute(IJobExecutionContext context)
    {
        var triggerId = context.Trigger.Key.Name;
        var trigger = await queryProvider.Rehydrate<RunCreationTrigger>(triggerId);
        if (trigger is not { Enabled: true })
            return;
        var plannedAt = GetClosestPastInstant(trigger.RecurrencePattern, clock.GetCurrentInstant());
        foreach (var roundId in trigger.RoundIds)
        {
            CreateRun(roundId, plannedAt);
        }
        //trigger.RoundIds.ForEach(roundId => messageBus.SendAsync(new CreateRun(roundId, plannedAt)));
    }

    private async Task CreateRun(string roundId, Instant? at)
    {
        var created = await messageBus.InvokeAsync<SurveillanceRunCreated>(new CreateRun(roundId, at));
        await messageBus.PublishAsync(created);
    }

    private static Instant? GetClosestPastInstant(string cronExpression, Instant now)
    {
        var expression = new CronExpression(cronExpression);
        var nowOffset = now.InZone(DateTimeZone.Utc).ToDateTimeOffset();

        // Get the closest valid time in the past
        var previousTime = expression.GetNextValidTimeAfter(nowOffset.AddSeconds(-1));
        return previousTime?.ToInstant();
    }
}