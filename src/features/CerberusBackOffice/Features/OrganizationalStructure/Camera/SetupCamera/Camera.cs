using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera;

public partial class Camera :
    IDomainEventHandler<CameraUpdated>,
    IDomainEventHandler<CameraCreated>,
    IDomainEventHandler<CameraLocationChanged>,
    IDomainEventHandler<CameraRecurrencePatternChanged>
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
                path,
                command.BrandName,
                command.ModelName,
                command.Price,
                command.ManufactureYear
                )
            );
    }
    public void Handle(SetupCameraCommand setupCamera, string path)
    {
        var cmd = new SetupCameraCommand(this.Id, this.ParentId, this.Description,
            this.AdminSettings, this.FunctionalSettings, this.BrandName, this.ModelName, this.Price, this.ManufactureYear);
        if(cmd.Equals(setupCamera) && path == this.Path)
            return;
        this.HandleLocationChange(setupCamera, path);
        this.HandleRecurrencePatternChange(setupCamera);
        this.ApplyUncommittedEvent(new CameraUpdated(this.Id, setupCamera.ParentId, setupCamera.Description, setupCamera.AdminSettings, setupCamera.FunctionalSettings, path, setupCamera.BrandName, setupCamera.ModelName, setupCamera.Price, setupCamera.ManufactureYear));
    }
    
    private void HandleLocationChange(SetupCameraCommand setupCamera, string path)
    {
        if(setupCamera.ParentId != this.ParentId)
            this.ApplyUncommittedEvent(new CameraLocationChanged(this.ParentId, setupCamera.ParentId, path));
    }
    
    private void HandleRecurrencePatternChange(SetupCameraCommand setupCamera)
    {
        if(this.AdminSettings.CaptureRecurrencePattern != setupCamera.AdminSettings?.CaptureRecurrencePattern)
            this.ApplyUncommittedEvent(new CameraRecurrencePatternChanged(setupCamera.Id, this.AdminSettings.CaptureRecurrencePattern, setupCamera.AdminSettings?.CaptureRecurrencePattern ?? string.Empty));
    }
    

    public void Apply(CameraUpdated @event)
    {
        this.Description = @event.Description;
        this.AdminSettings = @event.AdminSettings;
        this.FunctionalSettings = @event.FunctionalSettings;
        this.BrandName = @event.BrandName;
        this.ModelName = @event.ModelName;
        this.Price = @event.Price;
        this.ManufactureYear = @event.ManufactureYear;
        
    }

    public void Apply(CameraCreated @event)
    {
        this.Id = @event.CameraId;
        this.ParentId = @event.ParentId;
        this.Description = @event.Description;
        this.AdminSettings = @event.AdminSettings;
        this.FunctionalSettings = @event.FunctionalSettings;
        this.Path = @event.Path;
        this.BrandName = @event.BrandName;
        this.ModelName = @event.ModelName;
        this.Price = @event.Price;
        this.ManufactureYear = @event.ManufactureYear;
    }

    public void Apply(CameraLocationChanged @event)
    {
        this.ParentId = @event.NewLocationId;
        this.Path = @event.Path;
    }

    public void Apply(CameraRecurrencePatternChanged @event)
    {
        this.AdminSettings = this.AdminSettings with { CaptureRecurrencePattern = @event.NewPattern };
    }
}