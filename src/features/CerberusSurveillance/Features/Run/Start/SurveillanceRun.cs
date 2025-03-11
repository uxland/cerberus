using Cerberus.Core.Domain.Errors;
using Cerberus.Surveillance.Features.Features.Run.MoveToInspection;
using Cerberus.Surveillance.Features.Features.Run.Start;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run;

public partial class SurveillanceRun
{
    public void Start(Instant at)
    {
        if(this.ValidateCanStart())
            this.ApplyUncommittedEvent(new SurveillanceRunStarted(this.Id, "SDDDD", at, RunStatus.Running));
        this.Handle(new MoveToNextInspection());
    }
    
    public void Apply(SurveillanceRunStarted @event)
    {
        this.StartedAt = @event.At;
        this.Status = @event.Status;
        this.ExecutorId = @event.By;
    }
    
    private bool ValidateCanStart()
    {
        switch (this.Status)
        {
            case RunStatus.Pending:
                return true;
            case RunStatus.Completed:
            case RunStatus.Dismissed:
                throw new BusinessException("Run is already completed or dismissed");
            default:
                return false;
        }
    }
    
}