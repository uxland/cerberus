using Cerverus.Maintenance.Features.Features.Issues.GetDetail;

namespace Cerverus.UI.Infrastructure.Maintenance.Isues;

public class MaintenanceIssueDetailGetter(ApiClient apiClient)
{
    public Task<MaintenanceIssueDetail?> Get(string id)
    {
        return apiClient.GetItems<MaintenanceIssueDetail>($"maintenance-issues/{id}");
    }
}