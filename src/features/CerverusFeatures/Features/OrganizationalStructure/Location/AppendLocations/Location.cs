using Cerverus.Features.Features.OrganizationalStructure.Location.AppendLocations;

namespace Cerverus.Features.Features.OrganizationalStructure.Location;

public partial class Location
{
    public Location(AppendLocation command, string path)
    {
        this.ApplyUncommittedEvent(new LocationCreated(command.Id, path, command.Description,
            command.DefaultCameraAdminSettings, command.DefaultCameraFunctionalSettings));
    }

    public void Apply(LocationCreated @event)
    {
        this.Path = @event.Path;
        this.Id = @event.Id;
        this.Description = @event.Description;
        this.DefaultCameraAdminSettings = @event.DefaultCameraAdminSettings;
        this.DefaultCameraFunctionalSettings = @event.DefaultCameraFunctionalSettings;
    }
}