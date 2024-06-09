using Cerverus.Maintenance.Features.Features.Issues.ListByLocationPath;

namespace Cerverus.UI.Infrastructure.Maintenance.Isues;

public class IssueSummaryGetter(ApiClient apiClient)
{
    public Task<List<PendingMaintenanceIssueSummary>> GetByLocation(string locationPath)
    {
        return apiClient.GetItems<List<PendingMaintenanceIssueSummary>>($"locations/{locationPath}/maintenance-issues");
    }
}