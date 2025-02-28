using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Run.Create;

public static class Endpoint
{
    public  static RouteGroupBuilder UseCreateRun(this RouteGroupBuilder app)
    {
        app.MapPost("", async (CreateRun command, IMessageBus messageBus) =>
        {
            var url = await messageBus.InvokeAsync<string>(command); //surveillance/runs/{id}
            return Results.Created(url, url);
        });
        return app;
    }
}