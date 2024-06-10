using Cerberus.BackOffice.Features.Captures;

namespace Cerberus.UI.Infrastructure;

public class CameraCapturesGetter(ApiClient apiClient)
{
    public Task<List<Capture>> GetCameraCaptures(string cameraId)
    {
        return apiClient.GetItems<List<Capture>>($"cameras/{cameraId}/captures");
    }
}