using Cerverus.Core.Domain;

namespace Cerverus.Maintenance.Features.Features.Issues;

public partial class MaintenanceIssue: 
    IDomainEventHandler<MaintenanceIssueCreated>
{
    public MaintenanceIssue(CreateIssue createIssue)
    {
        this.Id = $"maintenance-issue-{createIssue.CaptureInfo.CaptureId}";
        this.ApplyUncommittedEvent(new MaintenanceIssueCreated(createIssue.MaintenanceProcessId, createIssue.CaptureInfo, createIssue.CaptureError, createIssue.Errors, MaintenanceIssueStatus.Open));
    }
    public void Apply(MaintenanceIssueCreated @event)
    {
        this.MaintenanceProcessId = @event.MaintenanceProcessId;
        this.CaptureInfo = @event.CaptureInfo;
        this.CaptureError = @event.CaptureError;
        this.AnalysisErrors = @event.MaintenanceIssue;
        this.Status = @event.Status;
    }
}