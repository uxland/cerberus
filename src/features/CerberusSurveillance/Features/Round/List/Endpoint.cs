using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Cerberus.Surveillance.Features.Features.Round.List;

internal static class Endpoint
{
    public static RouteGroupBuilder UseListRounds(this RouteGroupBuilder app)
    {
        app.MapGet("", async (IReadModelQueryProvider queryProvider, string? rootLocationId) =>
        {
            var spec = SurveillanceRoundSummarySpecifications.ByRootLocation(rootLocationId);
            var rounds = await queryProvider.List<SurveillanceRoundSummary>(spec);
            return Results.Ok(rounds);
        });
        return app;
    }
}