
using Cerverus.BackOffice.Features.OrganizationalStructure.Camera;

namespace Cerverus.UI.Infrastructure;

public class CameraDetailGetter(ApiClient apiClient)
{
    public Task<Camera?> GetCameraDetail(string cameraId)
    {
        return apiClient.GetItems<Camera>($"cameras/{cameraId}");
    }
}