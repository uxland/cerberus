using Cerberus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Location;

public sealed class LocationSettingsGetter(IGenericRepository repository):
    ILocationSettingsGetter
{
    public async Task<CameraAdminSettings > GetLocationSettings(string locationId)
    {
        var adminSettings = new CameraAdminSettings();
        var locations = await GetAllParentLocations(locationId);
        var settings = locations.Aggregate(adminSettings, (settings, location) => settings.Merge(location.DefaultCameraAdminSettings));
        return settings;
        
    }
    

    private async Task<List<Location>> GetAllParentLocations(string locationId)
    {
        var location = await repository.RehydrateOrThrow<Location>(locationId);
        var locations = new List<Location>{location};
        while(!string.IsNullOrEmpty(location.ParentId))
        {
            location = await repository.RehydrateOrThrow<Location>(location.ParentId);
            locations.Add(location);
        }
        return locations;
    }
}

public interface ILocationSettingsGetter
{
    public Task<CameraAdminSettings> GetLocationSettings(string locationId);
}