using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Operation.Create;

internal static class Endpoint
{
    public static RouteGroupBuilder UseCreateOperation(this RouteGroupBuilder app)
    {
        app.MapPost("", async (CreateOperation command, IMessageBus messageBus) =>
        {
            await messageBus.InvokeAsync(command);
            return Results.Created();
        });
        return app;
    }
}