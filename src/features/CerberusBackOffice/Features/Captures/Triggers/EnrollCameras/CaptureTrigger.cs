using Cerberus.BackOffice.Features.Captures.Triggers.EnrollCameras;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.Captures.Triggers;

public partial class CaptureTrigger: IDomainEventHandler<CamerasEnrolledToTrigger>
{
    public void Handle(EnrollCamerasToTrigger command)
    {
        this.ApplyUncommittedEvent(new CamerasEnrolledToTrigger(command.TriggerId, command.CameraIds));
        this.Enable();
    }
    public void Apply(CamerasEnrolledToTrigger @event)
    {
        this.CameraIds.UnionWith(@event.CameraIds);
    }
}