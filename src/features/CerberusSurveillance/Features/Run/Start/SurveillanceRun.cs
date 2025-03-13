using Cerberus.Core.Domain;
using Cerberus.Core.Domain.Errors;
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
        this.Handle(new MoveToNextInspection());
    }
    
    public void Apply(SurveillanceRunStarted @event)
    {
        this.StartedAt = @event.At;
        this.Status =RunStatus.Running;
        this.StartedBy = @event.By;
    }
    
    private bool ValidateCanStart()
    {
        switch (this.Status)
        {
            case RunStatus.Pending:
                return true;
            case RunStatus.Released:
            case RunStatus.Dismissed:
                throw new BusinessException("Run is already released or dismissed");
            default:
                return false;
        }
    }
    
}