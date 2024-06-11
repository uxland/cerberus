namespace Cerberus.UI.Infrastructure.Maintenance.Isues;

public class MaintenanceIssueCommander(ApiClient apiClient)
{
    public Task Start(string issueId) => apiClient.PutCommand($"maintenance-issues/{issueId}/start", new { });
    
    public Task End(string issueId) => apiClient.PutCommand($"maintenance-issues/{issueId}/end", new { });
}