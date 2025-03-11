using Cerberus.Surveillance.Features.Features.Run.MoveToInspection;

namespace Cerberus.Surveillance.Features.Features.Run;

public partial  class SurveillanceRun
{
    public void Handle(MoveToNextInspection cmd)
    {
        var next = this.InspectionRuns.FirstOrDefault(x => x.Status == RunStatus.Pending);
        if(next != null)
            this.ApplyUncommittedEvent(new MovedToInspection(this.Id, next.InspectionId));
    }
    
    public void Apply(MovedToInspection @event)
    {
        this.CurrentInspectionRunId = @event.InspectionId;
    }
}