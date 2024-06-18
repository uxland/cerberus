using Cerberus.BackOffice.Features.Captures.Triggers.Create;
using Cerberus.BackOffice.Features.Captures.Triggers.EjectCameras;
using Cerberus.BackOffice.Features.Captures.Triggers.EnrollCameras;
using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;
using Cerberus.Core.Domain;
using Wolverine.Attributes;

namespace Cerberus.BackOffice.Features.Captures.Triggers;

public static class Handler
{
    [Transactional]
    public static CaptureTriggerEnabled? Handle(CameraCreated @event, IGenericRepository repository)
    {
        return EnrollCamera(@event.AdminSettings.CaptureRecurrencePattern, @event.CameraId, repository);
    }
    
    [Transactional]
    public static IEnumerable<object?> Handle(CameraRecurrencePatternChanged @event, IGenericRepository repository)
    {
        var (cameraId, previousPattern, newPattern) = @event;
        yield return EjectCamera(previousPattern, cameraId, repository);
        yield return EnrollCamera(newPattern, cameraId, repository);
        
    }
    
    private static CaptureTriggerEnabled? EnrollCamera(string recurrencePattern, string cameraId, IGenericRepository repository)
    {
        var trigger = repository.Rehydrate<CaptureTrigger>(recurrencePattern).ConfigureAwait(true).GetAwaiter().GetResult();
        trigger = trigger == null ? Create(recurrencePattern, cameraId, repository) : EnrollCamera(trigger, cameraId, repository);
        return trigger!.GeFirstUncommittedEventOfType<CaptureTriggerEnabled>();
    }
    
    
    private static CaptureTrigger Create(string recurrencePattern, string cameraId, IGenericRepository repository)
    {
        var trigger = new CaptureTrigger(new CreateCaptureTrigger(recurrencePattern, [cameraId]));
        repository.Create(trigger);
        return trigger;
    }
    
    private static CaptureTrigger? EnrollCamera(CaptureTrigger trigger, string cameraId, IGenericRepository repository)
    {
        trigger.Handle(new EnrollCamerasToTrigger(trigger.RecurrencePattern, [cameraId]));
        repository.Save(trigger);
        return trigger;
    }
    
    private static CaptureTriggerDisabled? EjectCamera(string recurrencePattern, string cameraId, IGenericRepository repository)
    {
        var trigger = repository.Rehydrate<CaptureTrigger>(recurrencePattern).Result;
        if(trigger == null)
            return null;
        trigger.Handle(new EjectCamerasFromTrigger(trigger.Id, [cameraId]));
        repository.Save(trigger);
        return trigger.GeFirstUncommittedEventOfType<CaptureTriggerDisabled>();
    }
}