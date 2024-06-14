using Cerberus.BackOffice.Features.Captures.Triggers.EjectCameras;
using Cerberus.Core.Domain;
using Marten;

namespace Cerberus.BackOffice.Features.Captures.Triggers;

public partial class CaptureTrigger: 
    IDomainEventHandler<CamerasEjectedFromTrigger>
{
    
    public void Handle(EjectCamerasFromTrigger command)
    {
        this.ApplyUncommittedEvent(new CamerasEjectedFromTrigger(command.CameraIds));
        if(this.CameraIds.IsEmpty())
            this.Disable();
            
    }
    
    public void Apply(CamerasEjectedFromTrigger @event)
    {
        this.CameraIds.ExceptWith(@event.CameraIds);
    }
    
} 