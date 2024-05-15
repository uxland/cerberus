using Cerverus.Core.Domain;
using Cerverus.Features.Features.OrganizationalStructure.Shared;
using Cerverus.Features.Features.Shared;

namespace Cerverus.Features.Features.OrganizationalStructure.Location;

internal sealed class LocationSettingsGetter(IRepository<Location> locationRepository):
    ILocationSettingsGetter,
    IRepositoryHandlerMixin<Location>
{
    public async Task<(CameraAdminSettings AdminSettings, CameraFunctionalSettings FunctionalSettings)> GetLocationSettings(string locationId)
    {
        var adminSettings = new CameraAdminSettings();
        var functionalSettings = new CameraFunctionalSettings(new List<CameraFilter>());
        var locations = await GetAllParentLocations(locationId);
        var settings = locations.Aggregate((adminSettings, functionalSettings), (settings, location) => (
            settings.adminSettings.Merge(location.DefaultCameraAdminSettings),
            settings.functionalSettings.Merge(location.DefaultCameraFunctionalSettings)
        ));
        return settings;
        
    }
    

    private async Task<List<Location>> GetAllParentLocations(string locationId)
    {
        var location = await this.Rehydrate(locationId);
        var locations = new List<Location>{location};
        while(!string.IsNullOrEmpty(location.ParentId))
        {
            location = await this.Rehydrate(location.ParentId);
            locations.Add(location);
        }
        return locations;
    }
    public IRepositoryBase<Location> Repository => locationRepository;
}

public interface ILocationSettingsGetter
{
    public Task<(CameraAdminSettings AdminSettings, CameraFunctionalSettings FunctionalSettings)> GetLocationSettings(string locationId);
}