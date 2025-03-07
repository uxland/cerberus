using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Operation.Delete;

internal static class Endpoint
{
    public static RouteGroupBuilder UseDeleteOperation(this RouteGroupBuilder app)
    {
        app.MapDelete("/{id}", async (string id, IMessageBus messageBus) =>
        {
            await messageBus.InvokeAsync(new DeleteOperation(id));
            return Results.NoContent();
        });
        return app;
    }
}