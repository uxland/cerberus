using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Run.Trigger.EjectRounds;
using Marten;

namespace Cerberus.Surveillance.Features.Features.Run.Trigger;

public partial class RunCreationTrigger:
    IDomainEventHandler<RoundsEjectedFromTrigger>
{
    public void Handle(EjectRoundsFromTrigger command)
    {
        this.ApplyUncommittedEvent(new RoundsEjectedFromTrigger(command.RoundIds));
        if(this.RoundIds.IsEmpty())
            this.Disable();
    }
    public void Apply(RoundsEjectedFromTrigger @event)
    {
        this.RoundIds.ExceptWith(@event.RoundIds);
    }
}