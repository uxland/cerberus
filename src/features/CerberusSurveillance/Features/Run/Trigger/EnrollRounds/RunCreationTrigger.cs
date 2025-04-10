using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Run.Trigger.EnrollRounds;

namespace Cerberus.Surveillance.Features.Features.Run.Trigger;

public partial class RunCreationTrigger: IDomainEventHandler<RoundsEnrolledToTrigger>
{
    public void Handle(EnrollRoundsToTrigger command)
    {
        this.ApplyUncommittedEvent(new RoundsEnrolledToTrigger(command.RoundIds));
        this.Enable();
    }
    public void Apply(RoundsEnrolledToTrigger @event)
    {
        this.RoundIds.UnionWith(@event.RoundIds);
    }
}