using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Round;

namespace Cerberus.Surveillance.Features.Features.Run.Create;

public static class Handler
{
    public static async Task<string> Handle(CreateRun command, IGenericRepository repository)
    {
        var round = await repository.RehydrateOrThrow<SurveillanceRound>(command.RoundId);
        var run = await round.ProduceRun(repository);
        repository.Create(run);
        return run.Id;
    }
}