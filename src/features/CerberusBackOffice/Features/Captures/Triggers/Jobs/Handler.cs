using Quartz;

namespace Cerberus.BackOffice.Features.Captures.Triggers.Jobs;

public static class Handler
{
    public static void Handle(CaptureTriggerEnabled captureTriggerEnabled, ISchedulerFactory schedulerFactory)
    {
        var trigger = TriggerBuilder.Create()
            .WithIdentity(captureTriggerEnabled.RecurrencePattern)
            .ForJob(CaptureJob.JobKey)
            .WithCronSchedule(captureTriggerEnabled.RecurrencePattern,
                x => x.WithMisfireHandlingInstructionIgnoreMisfires()
                    .InTimeZone(TimeZoneInfo.FindSystemTimeZoneById("Europe/Madrid")))
            .Build();
        var scheduler = schedulerFactory.GetScheduler().Result;
        scheduler.ScheduleJob(trigger);
    }

    public static Task Handle(CaptureTriggerDisabled captureTriggerDisabled, IScheduler scheduler)
    {
        return scheduler.UnscheduleJob(new TriggerKey(captureTriggerDisabled.RecurrencePattern));
    }
}