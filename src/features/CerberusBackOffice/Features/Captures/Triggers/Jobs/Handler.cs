using Quartz;

namespace Cerberus.BackOffice.Features.Captures.Triggers.Jobs;

public static class Handler
{
    public static void Handle(CaptureTriggerEnabled captureTriggerEnabled, IScheduler scheduler)
    {
        var trigger = TriggerBuilder.Create()
            .WithIdentity(captureTriggerEnabled.RecurrencePattern)
            .ForJob(CaptureJob.JobKey)
            .WithCronSchedule(captureTriggerEnabled.RecurrencePattern, x => x.WithMisfireHandlingInstructionFireAndProceed())
            .Build();
    }

    public static Task Handle(CaptureTriggerDisabled captureTriggerDisabled, IScheduler scheduler)
    {
        return scheduler.UnscheduleJob(new TriggerKey(captureTriggerDisabled.RecurrencePattern));
    }
}