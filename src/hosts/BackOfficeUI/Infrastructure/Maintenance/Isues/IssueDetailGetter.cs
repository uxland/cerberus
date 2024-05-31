using Cerverus.Maintenance.Features.Features.Issues.GetDetail;

namespace BackOfficeUI.Infrastructure.Maintenance.Isues;

public class MaintenanceIssueDetailGetter(ApiClient apiClient)
{
    public Task<MaintenanceIssueDetail?> Get(string id)
    {
        return apiClient.GetItems<MaintenanceIssueDetail>($"maintenance-issues/{id}");
    }
}

public class MaintenanceIssueCommander(ApiClient apiClient)
{
    public Task Start(string issueId) => apiClient.PutCommand($"maintenance-issues/{issueId}/start", new { });
    
    public Task End(string issueId) => apiClient.PutCommand($"maintenance-issues/{issueId}/end", new { });
}