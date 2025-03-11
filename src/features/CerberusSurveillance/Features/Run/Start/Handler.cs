using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Start;

internal static class Handler
{
    public static async Task<SurveillanceRun> Handle(StartRun command, IGenericRepository repository)
    {
        var run = await repository.RehydrateOrThrow<SurveillanceRun>(command.RunId);
        run.Start(SystemClock.Instance.GetCurrentInstant());
        repository.Save(run);
        return run;
    }
}