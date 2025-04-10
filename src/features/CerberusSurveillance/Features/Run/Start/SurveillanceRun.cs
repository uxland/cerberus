using Cerberus.Core.Domain;
using Cerberus.Core.Domain.Errors;
using Cerberus.Surveillance.Features.Features.Run.Claim;
using Cerberus.Surveillance.Features.Features.Run.MoveToInspection;
using Cerberus.Surveillance.Features.Features.Run.Start;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run;

public partial class SurveillanceRun
{
    public void Start(Instant at, User by)
    {
        if(this.ValidateCanStart())
            this.ApplyUncommittedEvent(new SurveillanceRunStarted(this.Id, by.Id, at));
        this.Handle(new ClaimRun(this.Id, at, by));
        this.Handle(new MoveToNextInspection());
    }
    
    public void Apply(SurveillanceRunStarted @event)
    {
        this.StartedAt = @event.At;
        this.Status =RunStatus.Running;
        this.StartedBy = @event.By;
        this.LastActivityAt = @event.At;
        this.LastActivityBy = @event.By;
    }
    
    private bool ValidateCanStart()
    {
        return this.Status switch
        {
            RunStatus.Pending => true,
            var x when EndedStatuses.Contains(x) => throw new BusinessException(
                "Run is already released or dismissed or cancelled"),
            _ => false
        };
    }
    
}