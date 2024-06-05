using Cerverus.Core.Domain;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.Issues;

public partial class MaintenanceIssue: 
    IDomainEventHandler<MaintenanceIssueCreated>
{
    public MaintenanceIssue(CreateIssue createIssue)
    {
        this.Id = $"maintenance-issue-{createIssue.CaptureInfo.CaptureId}";
        this.ApplyUncommittedEvent(new MaintenanceIssueCreated(
            createIssue.MaintenanceProcessId, 
            createIssue.CaptureInfo, 
            createIssue.CaptureError, createIssue.Errors, MaintenanceIssueStatus.Open, new MaintenanceIssueCreation(createIssue.SentBy, SystemClock.Instance.GetCurrentInstant())));
    }
    public void Apply(MaintenanceIssueCreated @event)
    {
        this.MaintenanceProcessId = @event.MaintenanceProcessId;
        this.CaptureInfo = @event.CaptureInfo;
        this.CaptureError = @event.CaptureError;
        this.Errors = @event.Errors;
        this.Status = @event.Status;
        this.Creation = @event.Creation;
    }
}