
using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;

namespace Cerberus.UI.Infrastructure;

public class CameraDetailGetter(ApiClient apiClient)
{
    public Task<Camera?> GetCameraDetail(string cameraId)
    {
        return apiClient.GetItems<Camera>($"cameras/{cameraId}");
    }
}