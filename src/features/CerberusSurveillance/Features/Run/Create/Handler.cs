using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Round;
using NodaTime;
using Wolverine.Marten;

namespace Cerberus.Surveillance.Features.Features.Run.Create;

public static class Handler
{
    public static async Task<SurveillanceRunCreated> Handle(CreateRun command, IGenericRepository repository, IClock clock)
    {
        var round = await repository.RehydrateOrThrow<SurveillanceRound>(command.RoundId);
        var run = await round.ProduceRun(repository, command.PlannedAt ?? clock.GetCurrentInstant(), !command.PlannedAt.HasValue);
        repository.Create(run);
        return run.GeFirstUncommittedEventOfType<SurveillanceRunCreated>()!;
    }
}