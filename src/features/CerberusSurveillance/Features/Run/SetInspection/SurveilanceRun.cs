using Cerberus.Core.Domain.Errors;
using Cerberus.Surveillance.Features.Features.Run.MoveToInspection;
using Cerberus.Surveillance.Features.Features.Run.SetInspection;

namespace Cerberus.Surveillance.Features.Features.Run;

public partial class SurveillanceRun
{
    public void Handle(SetRunInspection cmd)
    {
        var inspectionRun = this.GetInspectionRunByIdOrFail(cmd.InspectionId);
        var answers = inspectionRun.OperationRun.ParseAnswers(cmd.OperationAnswers);
        if(!answers.Success)
            throw new BusinessException(answers.Error!);
        this.ApplyUncommittedEvent(
            new RunsInspectionSet(InspectionId: cmd.InspectionId,
                By: cmd.By,
                StartedAt: cmd.OperationAnswers.StartedAt,
                EndedAt: cmd.At,
                OperationRun: answers.Result!
                )
            );
        this.Handle(new MoveToNextInspection());
    }

    public void Apply(RunsInspectionSet runsInspectionSet)
    {
        var inspectionRun = this.GetInspectionRunById(runsInspectionSet.InspectionId);
        inspectionRun?.Apply(runsInspectionSet);
        if(this.CanRelease)
            this.Status = RunStatus.Completed;
    }
    
}