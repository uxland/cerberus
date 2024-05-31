using Cerverus.Core.Domain;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.Issues;

public partial class MaintenanceIssue: IDomainEventHandler<MaintenanceIssueEnded>
{
    public void End(Instant at, string maintenanceUser, EndMaintenanceIssue command)
    {
        if(this.Status != MaintenanceIssueStatus.InCourse)
            return;
        this.ApplyUncommittedEvent(new MaintenanceIssueEnded(this.MaintenanceProcessId, at, maintenanceUser, MaintenanceIssueStatus.Closed, command.Comment));
    }
    
    public void Apply(MaintenanceIssueEnded @event)
    {
        this.Execution = this.Execution! with
        {
            EndedBy = @event.By,
            EndedAt = @event.At,
            Comment = @event.Comment
        };
        this.Status = @event.Status;
    }
}