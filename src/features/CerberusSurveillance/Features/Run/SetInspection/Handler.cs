using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Run.SetInspection;

public static class Handler
{
    public static async Task<SurveillanceRun> Handle(SetRunInspection command, IGenericRepository repository)
    {
        var run = await repository.RehydrateOrThrow<SurveillanceRun>(command.RunId);
        var inspection = run.InspectionRuns.Single(i => i.Id == command.InspectionId);
        inspection.SetAnswers(command.OperationAnswers);
        repository.Save(run);
        return run;
        /*/var inspection = await repository.RehydrateOrThrow<Inspection>(command.InspectionId);
        run.SetInspection(inspection, command.OperationAnswers);
        repository.Update(run);
        return run;*/
    }
}