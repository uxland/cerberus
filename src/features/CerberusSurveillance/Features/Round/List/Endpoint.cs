using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Cerberus.Surveillance.Features.Features.Round.List;

internal static class Endpoint
{
    public static RouteGroupBuilder UseListRounds(this RouteGroupBuilder app)
    {
        app.MapGet("", async (IReadModelQueryProvider queryProvider) =>
        {
            var rounds = await queryProvider.ListAsJson<SurveillanceRoundSummary>();
            return Results.Ok(rounds);
        });
        return app;
    }
}