using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Round.Delete;

internal static class Endpoint
{
    public static RouteGroupBuilder UseDeleteRound(this RouteGroupBuilder app)
    {
        app.MapDelete("/{id}", async (string id, IMessageBus messageBus) =>
        {
            await messageBus.InvokeAsync(new DeleteRound(id));
            return Results.NoContent();
        });
        return app;
    }
}