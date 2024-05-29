using Cerverus.Core.Domain;
using Cerverus.Features.Features.Captures;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Shared;

namespace Cerverus.Maintenance.Features.Features.Issues;

public record CreateIssue(
    CaptureInfo CaptureInfo,
    CaptureError? CaptureError,
    List<FilterResult> MaintenanceIssue) : ICommand;

public record MaintenanceIssueCreated(CaptureInfo CaptureInfo, CaptureError? CaptureError, List<FilterResult> MaintenanceIssue, MaintenanceIssueStatus Status) : IDomainEvent;

public partial class MaintenanceIssue: 
    IDomainEventHandler<MaintenanceIssueCreated>
{
    public MaintenanceIssue(CreateIssue createIssue)
    {
        this.Id = $"maintenance-issue-{createIssue.CaptureInfo.CaptureId}";
        this.ApplyUncommittedEvent(new MaintenanceIssueCreated(createIssue.CaptureInfo, createIssue.CaptureError, createIssue.MaintenanceIssue, MaintenanceIssueStatus.Open));
    }
    public void Apply(MaintenanceIssueCreated @event)
    {
        this.CaptureInfo = @event.CaptureInfo;
        this.CaptureError = @event.CaptureError;
        this.AnalysisErrors = @event.MaintenanceIssue;
        this.Status = @event.Status;
    }
}