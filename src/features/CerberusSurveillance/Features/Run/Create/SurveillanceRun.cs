using Cerberus.Surveillance.Features.Features.Run.Create;

namespace Cerberus.Surveillance.Features.Features.Run;

public partial class SurveillanceRun
{
    public SurveillanceRun(string id, string rootLocationId, string roundId, string? assignedGroupId, List<InspectionRun> inspectionRuns): this()
    {
        this.ApplyUncommittedEvent(new SurveillanceRunCreated(id,
            rootLocationId,
            roundId,
            assignedGroupId,
            inspectionRuns
        ));
    }

    public void Apply(SurveillanceRunCreated @event)
    {
        this.Id = @event.Id;
        this.RoundId = @event.RoundId;
        this.RootLocationId = @event.RootLocationId;
        this.AssignedGroupId = @event.AssignedGroupId;
        this.InspectionRuns = @event.InspectionRuns;
    }
}