using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Run.Trigger.Create;

namespace Cerberus.Surveillance.Features.Features.Run.Trigger;

public partial class RunCreationTrigger:
    IDomainEventHandler<RunCreationTriggerCreated>
{
    public RunCreationTrigger(CreateRunCreationTrigger command)
    {
        this.ApplyUncommittedEvent(new RunCreationTriggerCreated(command.RecurrencePattern, command.RoundIds));
        this.Enable();
    }
    public void Apply(RunCreationTriggerCreated @event)
    {
        this.Id = @event.RecurrencePattern;
        this.RecurrencePattern = @event.RecurrencePattern;
        this.RoundIds.UnionWith(@event.RoundIds);
    }
}