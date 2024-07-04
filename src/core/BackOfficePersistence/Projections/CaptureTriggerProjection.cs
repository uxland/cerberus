/*using Cerberus.BackOffice.Features.Captures.Triggers;
using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;
using Marten;
using Marten.Events;
using Marten.Events.Projections;

namespace Cerberus.BackOffice.Persistence.Projections;

public class CaptureTriggerProjection: MultiStreamProjection<CaptureTrigger, string>
{
    public CaptureTriggerProjection()
    {
        Identity<CameraCreated>(x => x.AdminSettings.CaptureRecurrencePattern);
        Identities<CameraRecurrencePatternChanged>(x => new []{x.NewPattern, x.PreviousPattern});
        
    }

    public void Apply(IEvent<CameraRecurrencePatternChanged> @event, CaptureTrigger trigger, IDocumentSession documentSession)
    {
        if (trigger.RecurrencePattern == @event.Data.PreviousPattern)
            trigger.CameraIds.Remove(@event.StreamKey!);
        if (trigger.RecurrencePattern == @event.Data.NewPattern)
            trigger.CameraIds.Add(@event.StreamKey!);
        if(trigger.CameraIds.Count == 0)
            documentSession.Delete(trigger);
    }
        
    public void Apply(IEvent<CameraCreated> @event, CaptureTrigger trigger) => 
        trigger.CameraIds.Add(@event.StreamKey!);
}*/