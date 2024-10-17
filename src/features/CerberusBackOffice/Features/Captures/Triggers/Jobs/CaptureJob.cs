using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Cerberus.Core.Domain;
using Quartz;
using Wolverine;

namespace Cerberus.BackOffice.Features.Captures.Triggers.Jobs;

public class CaptureJob(IReadModelQueryProvider queryProvider, IMessageBus messageBus): IJob
{
    public const string JobKey = "CaptureJob";
    public async Task Execute(IJobExecutionContext context)
    {
        var triggerId = context.Trigger.Key.Name;
        var trigger = await queryProvider.Rehydrate<CaptureTrigger>(triggerId);
        if (trigger == null || !trigger.Enabled)
            return;
        await messageBus.SendAsync(new CaptureCameraSnapshots(trigger.CameraIds));
    }
}