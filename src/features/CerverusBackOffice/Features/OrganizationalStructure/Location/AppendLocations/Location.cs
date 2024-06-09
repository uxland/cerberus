using Cerverus.BackOffice.Features.OrganizationalStructure.Location.AppendLocations;
using Cerverus.Core.Domain;

namespace Cerverus.BackOffice.Features.OrganizationalStructure.Location;

public partial class Location :
    IDomainEventHandler<LocationCreated>,
    IDomainEventHandler<LocationUpdated>
{
    public Location(SetupLocation command, string path)
    {
        this.ApplyUncommittedEvent(new LocationCreated(command.Id, command.ParentId, path, command.Description,
            command.DefaultCameraAdminSettings, command.DefaultCameraFunctionalSettings));
    }
    public void Handle(SetupLocation setupLocation, string path)
    {
        var reference = new SetupLocation(this.Id, this.ParentId, this.Description, this.DefaultCameraAdminSettings, this.DefaultCameraFunctionalSettings);
        if(reference.Equals(setupLocation) && this.Path == path)
            return;
        this.ApplyUncommittedEvent(new LocationUpdated(path, setupLocation.ParentId, setupLocation.Description, setupLocation.DefaultCameraAdminSettings, setupLocation.DefaultCameraFunctionalSettings));
    }

    public void Apply(LocationCreated @event)
    {
        this.Path = @event.Path;
        this.Id = @event.Id;
        this.ParentId = @event.ParentId;
        this.Description = @event.Description;
        this.DefaultCameraAdminSettings = @event.DefaultCameraAdminSettings;
        this.DefaultCameraFunctionalSettings = @event.DefaultCameraFunctionalSettings;
    }

    public void Apply(LocationUpdated @event)
    {
        this.Path = @event.Path;
        this.ParentId = @event.ParentId;
        this.Description = @event.Description;
        this.DefaultCameraAdminSettings = @event.DefaultCameraAdminSettings;
        this.DefaultCameraFunctionalSettings = @event.DefaultCameraFunctionalSettings;
    }
}