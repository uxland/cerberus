using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Round.Create;

internal static class Endpoint
{
    public static RouteGroupBuilder UseCreateRound(this RouteGroupBuilder app)
    {
        app.MapPost("", async (CreateRound command, IMessageBus messageBus) =>
        {
            await messageBus.InvokeAsync(command);
            return Results.Created();
        });
        return app;
    }
}