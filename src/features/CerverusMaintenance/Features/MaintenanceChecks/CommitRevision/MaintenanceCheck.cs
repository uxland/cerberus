using Cerverus.Core.Domain;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

public partial class MaintenanceCheck:
    IDomainEventHandler<MaintenanceCheckReviewed>
{
    
    public void CommitRevision(string reviewerUser, Instant at)
    {
        this.ApplyUncommittedEvent(new MaintenanceCheckReviewed(reviewerUser, at));
    }
    
    public void Apply(MaintenanceCheckReviewed @event)
    {
        this.Revision = new Revision(@event.ReviewerUser, @event.At);
    }
}