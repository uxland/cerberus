using Cerberus.Core.Domain;

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
            this.ApplyUncommittedEvent(new CaptureTriggerEnabled(this.RecurrencePattern));
    }

    private void Disable()
    {
        if (this.Enabled)
            this.ApplyUncommittedEvent(new CaptureTriggerDisabled(this.RecurrencePattern));
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

public record CaptureTriggerEnabled(string RecurrencePattern) : IDomainEvent;
public record CaptureTriggerDisabled(string RecurrencePattern) : IDomainEvent;