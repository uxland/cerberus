using Cerberus.Surveillance.Features.Features.Run.SetInspection;

namespace Cerberus.Surveillance.Features.Features.Run;

public partial class InspectionRun
{
    internal void Apply(RunsInspectionSet @event)
    {
        this.Status = RunStatus.Completed;
        this.StartedAt = @event.StartedAt;
        this.EndedAt = @event.EndedAt;
        this.OperationRun = @event.OperationRun;
        this.ExecutorId = @event.By;
    }
}