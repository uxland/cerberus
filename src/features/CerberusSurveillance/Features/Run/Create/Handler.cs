using Cerberus.Core.Domain;
using System.Threading.Tasks;

namespace Cerberus.Surveillance.Features.Features.Run.Create;

public static class Handler
{
    public static async Task<string> Handle(CreateRun command, IGenericRepository repository)
    {
        var cmd = command with
        {
            Id = command.Id ?? Guid.NewGuid().ToString()
        };
        await VerifyItDoesNotExist(runId, repository);
        var run = new Run(cmd);
        repository.Create(run);
        return runId;
    }

    private static async Task VerifyItDoesNotExist(string runId, IGenericRepository repository)
    {
        var exists = await repository.Exists<SurveillanceRun>(runId);
        if (exists)
            throw new BusinessException($"Run with id {runId} already exists");
    }
}