using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate;

public static class Handler
{
    public static void Handle(CreateRound command, IGenericRepository repository)
    {
        var round = new SurveillanceRound(command); 
        repository.Create(round);
    }

    public static async Task Handle(UpdateRound command, IGenericRepository repository)
    {
        var round = await repository.RehydrateOrThrow<SurveillanceRound>(command.Id);
        round.Handle(command);
        repository.Save(round);
    }
    
}