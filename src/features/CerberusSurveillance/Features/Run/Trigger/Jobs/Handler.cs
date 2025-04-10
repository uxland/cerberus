using Cerberus.Surveillance.Features.Features.Run.Trigger.Create;
using Quartz;

namespace Cerberus.Surveillance.Features.Features.Run.Trigger.Jobs;

public static class Handler
{
    public static void Handle(RunCreationTriggerEnabled @event, ISchedulerFactory schedulerFactory)
    {
        var trigger = TriggerBuilder.Create()
            .WithIdentity(@event.RecurrencePattern)
            .ForJob(CreateRunJob.JobKey)
            .WithCronSchedule(@event.RecurrencePattern, x => x.WithMisfireHandlingInstructionIgnoreMisfires().InTimeZone(TimeZoneInfo.FindSystemTimeZoneById("Europe/Madrid")))
            .Build();
        var scheduler = schedulerFactory.GetScheduler().Result;
        scheduler.ScheduleJob(trigger);
    }

    public static Task Handle(RunCreationTriggerDisabled @event, IScheduler scheduler)
    {
        return scheduler.UnscheduleJob(new TriggerKey(@event.RecurrencePattern));
    }
}