namespace BackOfficeUI.Infrastructure;

public class CaptureClient(ApiClient apiClient)
{
    public Task CaptureSnapshot(string locationId)
    {
        return apiClient.PostCommand($"captures/{locationId}", null);
    }
}