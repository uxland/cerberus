using Cerberus.BackOffice.Features.Captures.Triggers.Create;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.Captures.Triggers;

public partial class CaptureTrigger:
    IDomainEventHandler<CaptureTriggerCreated>
{
    public CaptureTrigger(CreateCaptureTrigger command)
    {
        this.ApplyUncommittedEvent(new CaptureTriggerCreated(command.RecurrencePattern, command.CameraIds));
        this.Enable();
    }

    public void Apply(CaptureTriggerCreated @event)
    {
        this.Id = @event.RecurrencePattern;
        this.RecurrencePattern = @event.RecurrencePattern;
        this.CameraIds.UnionWith(@event.CameraIds);
    }
}