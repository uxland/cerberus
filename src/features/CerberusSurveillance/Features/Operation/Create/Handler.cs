using Cerberus.Core.Domain;
using Cerberus.Core.Domain.Errors;

namespace Cerberus.Surveillance.Features.Features.Operation.Create;

public static class Handler
{
    public static async Task Handle(CreateOperation command, IGenericRepository repository)
    {
        var cmd = command with
        {
            Id = command.Id ?? Guid.NewGuid().ToString()
        };
        await VerifyItDoesNotExist(command.Id!, repository);
        var operation = new SurveillanceOperation(cmd);
    }

    private static async Task VerifyItDoesNotExist(string operationId, IGenericRepository repository)
    {
        var exists = await repository.Exists<SurveillanceOperation>(operationId);
        if (exists)
            throw new BusinessException($"Surveillance operation with id {operationId} already exists");
    }
    
}