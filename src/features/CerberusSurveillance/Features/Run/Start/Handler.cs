using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Start;

public static class Handler
{
    public static async Task<SurveillanceRun> Handle(StartRun command, IGenericRepository repository, IClock clock, IUserContextProvider userContextProvider)
    {
        var run = await repository.RehydrateOrThrow<SurveillanceRun>(command.RunId);
        run.Start(clock.GetCurrentInstant(), userContextProvider.CurrentUser);
        repository.Save(run);
        return run;
    }
}