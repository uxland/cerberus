using Cerberus.Core.Domain.Errors;
using Cerberus.Surveillance.Features.Features.Run.Release;

namespace Cerberus.Surveillance.Features.Features.Run;

public partial class SurveillanceRun
{
    public void Handle(ReleaseRun cmd)
    {
        this.ValidateCanRelease();
        this.ValidateOwnerShip(cmd.By);
        this.ApplyUncommittedEvent(new SurveillanceRunReleased(cmd.At, cmd.By));
    }

    private void ValidateCanRelease()
    {
        if (!this.CanRelease)
            throw new BusinessException("Cannot release run");

    }

    public void Apply(SurveillanceRunReleased @event)
    {
        this.EndedAt = @event.At;
        this.EndedBy = @event.By;
        this.Status = RunStatus.Released;
        this.LastActivityAt = @event.At;
        this.LastActivityBy = @event.By;
    }
}