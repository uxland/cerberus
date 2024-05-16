
namespace BackOfficeUI.Infrastructure;

public class CameraThumbnailsGetter(ApiClient apiClient)
{
    public Task<List<string>> GetCameraThumbnails(string cameraId)
    {
        return apiClient.GetItems<List<string>>($"cameras/{cameraId}/thumbnails");
    }
}