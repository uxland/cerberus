using Cerberus.BackOffice.Features.OrganizationalStructure.Location;

namespace Cerberus.UI.Infrastructure;

public class LocationDetailGetter(ApiClient apiClient)
{
    public Task<Location?> GetLocationDetail(string locationId)
    {
        return apiClient.GetItems<Location>($"locations/{locationId}");
    }
}