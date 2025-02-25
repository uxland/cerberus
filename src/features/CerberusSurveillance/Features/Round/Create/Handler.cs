using Cerberus.Core.Domain;
using Cerberus.Core.Domain.Errors;

namespace Cerberus.Surveillance.Features.Features.Round.Create;

public static class Handler
{
    public static async Task Handle(CreateRound command, IGenericRepository repository)
    {
        var cmd = command with
        {
            Id = command.Id ?? Guid.NewGuid().ToString()
        };
        await VerifyItDoesNotExist(command.Id!, repository);
        var round = new SurveillanceRound(cmd); 
        repository.Create(round);
    }

    private static async Task VerifyItDoesNotExist(string roundId, IGenericRepository repository)
    {
        var exists = await repository.Exists<SurveillanceRound>(roundId);
        if (exists)
            throw new BusinessException($"Round with id {roundId} already exists");
    }
}