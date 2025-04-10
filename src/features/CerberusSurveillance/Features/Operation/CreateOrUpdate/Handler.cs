using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Operation.CreateOrUpdate;

public static class Handler
{
    public static void Handle(CreateOperation command, IGenericRepository repository)
    {
        var operation = new SurveillanceOperation(command);
        repository.Create(operation);
    }

    public static async Task Handle(UpdateOperation command, IGenericRepository repository)
    {
        var operation = await repository.RehydrateOrThrow<SurveillanceOperation>(command.Id);
        operation.Handle(command);
        repository.Save(operation);
    }

}