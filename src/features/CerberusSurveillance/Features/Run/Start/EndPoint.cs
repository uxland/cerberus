using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Run.Start;

public static class EndPoint
{
    public static RouteGroupBuilder UseStartRun(this RouteGroupBuilder app)
    {
        app.MapPut("/{id}:start", async (string id, IMessageBus messageBus) =>
        {
            var run = await messageBus.InvokeAsync<SurveillanceRun>(new StartRun(id));
            return Results.Ok(run);
        });
        return app;
    }
}