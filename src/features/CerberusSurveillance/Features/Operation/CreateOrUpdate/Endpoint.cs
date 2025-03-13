using Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Operation.CreateOrUpdate;

internal static class Endpoint
{
    public static RouteGroupBuilder UseCreateOrUpdateOperation(this RouteGroupBuilder app)
    {
        app.MapPost("", async (OperationSettings settings, IMessageBus messageBus) =>
        {
            await messageBus.InvokeAsync(new CreateOperation(settings));
            return Results.Created();
        });
        app.MapPut("/{id}", async (string id, OperationSettings settings, IMessageBus messageBus) =>
        {
            await messageBus.InvokeAsync(new UpdateOperation(id, settings));
            return Results.Ok();
        });
        return app;
    }
}