using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate;

internal static class Endpoint
{
    public static RouteGroupBuilder UseCreateRound(this RouteGroupBuilder app)
    {
        app.MapPost("", async (RoundSettings settings, IMessageBus messageBus) =>
        {
            await messageBus.InvokeAsync(new CreateRound(settings));
            return Results.Created();
        });
        app.MapPut("/{id}", async (string id, RoundSettings settings, IMessageBus messageBus) =>
        {
            await messageBus.InvokeAsync(new UpdateRound(id, settings));
            return Results.Ok();
        });
        return app;
    }
}