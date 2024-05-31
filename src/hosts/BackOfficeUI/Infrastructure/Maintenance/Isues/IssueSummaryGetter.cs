using Cerverus.Maintenance.Features.Features.Issues.ListByLocationPath;

namespace BackOfficeUI.Infrastructure.Maintenance.Isues;

public class IssueSummaryGetter(ApiClient apiClient)
{
    public Task<List<MaintenanceIssueSummary>> GetByLocation(string locationPath)
    {
        return apiClient.GetItems<List<MaintenanceIssueSummary>>($"locations/{locationPath}/maintenance-issues");
    }
}