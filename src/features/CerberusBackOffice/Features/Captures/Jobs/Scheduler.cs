using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Cerberus.Core.Domain;
using Hangfire;
using Microsoft.Extensions.DependencyInjection;
using Wolverine;

namespace Cerberus.BackOffice.Features.Captures.Jobs;

public static class Scheduler
{
    
    public static async Task Handle(ChronContainerCreatedOrChanged @event, IReadModelQueryProvider queryProvider, ServiceProvider provider)
    {
        var chron = await queryProvider.Rehydrate<ChronContainerDetail>(ChronContainer.ID) ?? new ChronContainerDetail();
        StopJobs(chron.RecurrencePatterns.Keys);
        ScheduleJobs(chron.RecurrencePatterns, provider);
    }
    
    private static void ScheduleJobs(Dictionary<string, List<string>> recurrencePatterns, ServiceProvider serviceProvider)
    {
        foreach (var (key, value) in recurrencePatterns)
            RecurringJob.AddOrUpdate(key, () => TriggerCapture(value, serviceProvider), key);

    }
    
    private static async void TriggerCapture(List<string> cameraIds, ServiceProvider serviceProvider)
    {
        var bus = serviceProvider.GetService<IMessageBus>()!;
        foreach (var cameraId in cameraIds)
           await bus.PublishAsync(CaptureCameraSnapshot.Create(cameraId));
    }
    
    private static void StopJobs(IEnumerable<string> jobIds)
    {
        foreach (var jobId in jobIds)
            RecurringJob.RemoveIfExists(jobId);
    }
}