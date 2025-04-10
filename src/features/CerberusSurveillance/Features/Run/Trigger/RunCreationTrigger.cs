
using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Run.Trigger;

public partial class RunCreationTrigger: AggregateRoot,
    IDomainEventHandler<RunCreationTriggerEnabled>,
    IDomainEventHandler<RunCreationTriggerDisabled>
{
    public RunCreationTrigger()
    {
        
    }
    public bool Enabled { get; set; }
    
    public string RecurrencePattern { get; set; }

    public HashSet<string> RoundIds { get; set; } = [];
    
    private void Enable()
    {
        if(!this.Enabled)
            this.ApplyUncommittedEvent(new RunCreationTriggerEnabled(this.RecurrencePattern));
    }
    private void Disable()
    {
        if (this.Enabled)
            this.ApplyUncommittedEvent(new RunCreationTriggerDisabled(this.RecurrencePattern));
    }
    
    public void Apply(RunCreationTriggerEnabled @event)
    {
        this.Enabled = true;
    }

    public void Apply(RunCreationTriggerDisabled @event)
    {
        this.Enabled = false;
    }
    
}

public record RunCreationTriggerEnabled(string RecurrencePattern) : IDomainEvent;
public record RunCreationTriggerDisabled(string RecurrencePattern) : IDomainEvent;