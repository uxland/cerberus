using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Release;

public static class Handler
{
    public static async Task Handle(ReleaseRun command, IGenericRepository repository, IClock clock,
        IUserContextProvider userContextProvider)
    {
        var run = await repository.RehydrateOrThrow<SurveillanceRun>(command.RunId);
        run.Handle(command);
        repository.Save(run);
    }
}