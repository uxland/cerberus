using Cerverus.BackOffice.Features.OrganizationalStructure.Location;

namespace BackOfficeUI.Infrastructure;

public class LocationDetailGetter(ApiClient apiClient)
{
    public Task<Location?> GetLocationDetail(string locationId)
    {
        return apiClient.GetItems<Location>($"locations/{locationId}");
    }
}