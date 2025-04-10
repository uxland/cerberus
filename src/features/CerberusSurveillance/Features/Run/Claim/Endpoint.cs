using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using NodaTime;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Run.Claim;

public static class Endpoint
{
    public static RouteGroupBuilder UseClaimRun(this RouteGroupBuilder app)
    {
        app.MapPut("/{id}:claim", async (string id, IClock clock, IUserContextProvider contextProvider, IMessageBus messageBus) =>
        {
            var user = contextProvider.CurrentUser;
            var run = await messageBus.InvokeAsync<ClaimRunResult>(new ClaimRun(id, clock.GetCurrentInstant(), user));
            return Results.Ok(run);
        });
        return app;
    }
}