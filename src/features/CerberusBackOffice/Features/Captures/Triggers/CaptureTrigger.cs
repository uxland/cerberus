using Cerberus.Core.Domain;
using Marten;

namespace Cerberus.BackOffice.Features.Captures.Triggers;

public partial class CaptureTrigger: AggregateRoot,
    IDomainEventHandler<CaptureTriggerEnabled>,
    IDomainEventHandler<CaptureTriggerDisabled>
{
    public CaptureTrigger(){}
    public bool Enabled { get; set; }
    public string RecurrencePattern { get; set; } = null!;
    public HashSet<string> CameraIds { get; set; } = [];

    private void Enable()
    {
        if(!this.Enabled)
            this.ApplyUncommittedEvent(new CaptureTriggerEnabled());
    }

    private void Disable()
    {
        if (this.Enabled)
            this.ApplyUncommittedEvent(new CaptureTriggerDisabled());
    }

    public void Apply(CaptureTriggerEnabled @event)
    {
        this.Enabled = true;
    }

    public void Apply(CaptureTriggerDisabled @event)
    {
        this.Enabled = false;
    }
}   

public class CaptureTriggerEnabled : IDomainEvent;
public class CaptureTriggerDisabled : IDomainEvent;