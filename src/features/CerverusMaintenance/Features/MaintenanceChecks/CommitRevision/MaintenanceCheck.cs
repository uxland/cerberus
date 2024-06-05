using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.MaintenanceChecks.CommitRevision;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

public partial class MaintenanceCheck:
    IDomainEventHandler<MaintenanceCheckReviewed>
{
    
    public void CommitRevision(CommitRevisionCommand command, string reviewerUser, Instant at)
    {
        this.ApplyUncommittedEvent(new MaintenanceCheckReviewed(this.MaintenanceProcessId, this.CaptureInfo, command.RevisionResults, this.CaptureError, reviewerUser, at));
    }
    
    public void Apply(MaintenanceCheckReviewed @event)
    {
        this.Status = MaintenanceCheckStatus.Completed;
        this.Revision = new Revision(@event.ReviewerUser, @event.At);
        this.AnalysisResults = @event.FilterResults;
    }
}