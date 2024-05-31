
using Cerverus.Core.Domain;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.Issues;

public partial class MaintenanceIssue: IDomainEventHandler<IssueResolutionStarted>
{
    public void Start(Instant at, string by)
    {
        if(this.Status != MaintenanceIssueStatus.Open)
            return;
        this.ApplyUncommittedEvent(new IssueResolutionStarted(at, by, MaintenanceIssueStatus.InCourse));
    }
    
    public void Apply(IssueResolutionStarted @event)
    {
        this.Status = @event.Status;
        this.Execution = new MaintenanceExecution(@event.By, @event.At);
    }
}