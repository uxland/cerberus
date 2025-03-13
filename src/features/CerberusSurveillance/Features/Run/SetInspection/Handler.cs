using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Run.SetInspection;

public static class Handler
{
    public static async Task<SurveillanceRun> Handle(SetRunInspection command, IGenericRepository repository)
    {
        var run = await repository.RehydrateOrThrow<SurveillanceRun>(command.RunId);
        run.Handle(command);
        repository.Save(run);
        return run;
    }
}