using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using NodaTime;
using Wolverine;
namespace Cerberus.Surveillance.Features.Features.Run.Release;

public static class EndPoint
{
    public static RouteGroupBuilder UseReleaseRun(this RouteGroupBuilder app)
    {
        app.MapPut("/{id}:release", async (string id, ReleaseRunData payload, IMessageBus messageBus, IUserContextProvider userContextProvider, IClock clock) =>
        {
            await messageBus.InvokeAsync<SurveillanceRun>(new ReleaseRun(id, clock.GetCurrentInstant(), userContextProvider.UserId, payload.AdditionalComments));
            return Results.Ok();
        });
        return app;
    }
}