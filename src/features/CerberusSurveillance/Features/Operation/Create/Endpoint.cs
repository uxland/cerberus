using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Operation.Create;

internal static class Endpoint
{
    public static WebApplication UseCreateOperation(this WebApplication app)
    {
        app.MapPost("/api/surveillance/operations", async (CreateOperation command, IMessageBus messageBus) =>
        {
            await messageBus.InvokeAsync(command);
            return Results.Created();
        });
        return app;
    }
}