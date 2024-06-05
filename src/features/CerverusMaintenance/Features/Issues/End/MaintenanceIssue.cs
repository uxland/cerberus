using Cerverus.Core.Domain;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.Issues;

public partial class MaintenanceIssue: IDomainEventHandler<MaintenanceIssueEnded>
{
    public MaintenanceIssueRevolved? End(Instant at, string maintenanceUser, EndMaintenanceIssue command)
    {
        if(this.Status != MaintenanceIssueStatus.InCourse)
            return null;
        this.ApplyUncommittedEvent(new MaintenanceIssueEnded(at, maintenanceUser, MaintenanceIssueStatus.Closed, command.Comment));
        return new MaintenanceIssueRevolved(this.MaintenanceProcessId);
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

public record MaintenanceIssueRevolved(string MaintenanceProcessId);