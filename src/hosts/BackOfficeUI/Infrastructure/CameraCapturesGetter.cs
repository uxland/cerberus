using Cerverus.BackOffice.Features.Captures;

namespace BackOfficeUI.Infrastructure;

public class CameraCapturesGetter(ApiClient apiClient)
{
    public Task<List<Capture>> GetCameraCaptures(string cameraId)
    {
        return apiClient.GetItems<List<Capture>>($"cameras/{cameraId}/captures");
    }
}