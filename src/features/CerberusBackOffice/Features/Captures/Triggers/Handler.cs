using Cerberus.BackOffice.Features.Captures.Triggers.EjectCameras;
using Cerberus.BackOffice.Features.Captures.Triggers.EnrollCameras;
using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;
using Cerberus.Core.Domain;
using Marten.Events;

namespace Cerberus.BackOffice.Features.Captures.Triggers.Create;

public static class Handler
{
    public static async Task<object?> Handle(CameraCreated @event, IGenericRepository repository)
    {
        var trigger = await repository.Rehydrate<CaptureTrigger>(@event.AdminSettings.CaptureRecurrencePattern);
        if(trigger == null)
            trigger = await Create(@event.AdminSettings.CaptureRecurrencePattern, @event.CameraId!, repository);
        else
            await EnrollCamera(trigger, @event.CameraId!, repository);
        return trigger.GeFirstUncommittedEventOfType<CaptureTriggerEnabled>();
    }
    
    public static async Task<IEnumerable<object>> Handle(CameraRecurrencePatternChanged @event, IGenericRepository repository)
    {
        var result = new List<object>();
       var ejectResult = await EjectCamera(@event.PreviousPattern, @event.CameraId, repository);
       if (ejectResult != null)
         result.Add(ejectResult);
       var newTrigger = await repository.Rehydrate<CaptureTrigger>(@event.NewPattern);
       if(newTrigger == null)
           newTrigger = await Create(@event.NewPattern, @event.CameraId, repository);
       else
           await EnrollCamera(newTrigger, @event.CameraId, repository);
       return result;
    }
    
    private static async Task<CaptureTrigger> Create(string recurrencePattern, string cameraId, IGenericRepository repository)
    {
        var trigger = new CaptureTrigger(new CreateCaptureTrigger(recurrencePattern, [cameraId]));
        await repository.Create(trigger);
        return trigger;
    }
    
    private static async Task EnrollCamera(CaptureTrigger trigger, string cameraId, IGenericRepository repository)
    {
        trigger.Handle(new EnrollCamerasToTrigger(trigger.RecurrencePattern, [cameraId]));
        await repository.Save(trigger);
    }
    
    private static async Task<CaptureTriggerDisabled?> EjectCamera(string recurrencePattern, string cameraId, IGenericRepository repository)
    {
        var trigger = await repository.Rehydrate<CaptureTrigger>(recurrencePattern);
        if(trigger == null)
            return null;
        trigger.Handle(new EjectCamerasFromTrigger(trigger.Id, [cameraId]));
        await repository.Save(trigger);
        return trigger.GeFirstUncommittedEventOfType<CaptureTriggerDisabled>();
    }
}