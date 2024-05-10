using Cerverus.Core.Domain;
using Cerverus.Features.Features.OrganizationalStructure.Camera.SetupCamera;

namespace Cerverus.Features.Features.OrganizationalStructure.Camera;

public partial class Camera :
    IDomainEventHandler<CameraUpdated>,
    IDomainEventHandler<CameraCreated>,
    IDomainEventHandler<CameraLocationChanged>
{
    public Camera(SetupCameraCommand command, string path)
    {
        this.ApplyUncommittedEvent(
            new CameraCreated(
                command.Id,
                command.ParentId,
                command.Description,
                command.AdminSettings,
                command.FunctionalSettings,
                path
                )
            );
    }
    public void Handle(SetupCameraCommand setupCamera, string path)
    {
        var cmd = new SetupCameraCommand(setupCamera.Id, setupCamera.ParentId, setupCamera.Description,
            setupCamera.AdminSettings, setupCamera.FunctionalSettings);
        if(cmd.Equals(setupCamera) && path == this.Path)
            return;
        if(setupCamera.ParentId != this.ParentId)
            this.ApplyUncommittedEvent(new CameraLocationChanged(this.ParentId, setupCamera.ParentId, path));
        this.ApplyUncommittedEvent(new CameraUpdated(setupCamera.ParentId, setupCamera.Description, setupCamera.AdminSettings, setupCamera.FunctionalSettings, path));
    }

    public void Apply(CameraUpdated @event)
    {
        this.Description = @event.Description;
        this.AdminSettings = @event.AdminSettings;
    }

    public void Apply(CameraCreated @event)
    {
        this.Id = @event.Id;
        this.ParentId = @event.ParentId;
        this.Description = @event.Description;
        this.AdminSettings = @event.AdminSettings;
        this.FunctionalSettings = @event.FunctionalSettings;
        this.Path = @event.Path;
    }

    public void Apply(CameraLocationChanged @event)
    {
        this.ParentId = @event.newLocationId;
        this.Path = @event.Path;
    }
}