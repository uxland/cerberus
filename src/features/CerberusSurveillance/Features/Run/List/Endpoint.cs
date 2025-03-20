using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Cerberus.Surveillance.Features.Features.Run.List;

public static class Endpoint
{
    public static RouteGroupBuilder UseListRuns(this RouteGroupBuilder app)
    {
        app.MapGet("", async (IReadModelQueryProvider queryProvider, string? locationId, string? roundId) =>
        {
            var spec = SurveillanceRunSummarySpecifications.ByLocationAndRound(locationId, roundId);
            var runs = await queryProvider.List(spec);
            return Results.Ok(runs);
        });
        return app;
    }
}