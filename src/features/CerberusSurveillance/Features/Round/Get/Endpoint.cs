using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Cerberus.Surveillance.Features.Features.Round.Get;

internal static class Endpoint
{
    public static RouteGroupBuilder UseGetRound(this RouteGroupBuilder app)
    {
        app.MapGet("/{id}", async (string id, IReadModelQueryProvider queryProvider) =>
        {
            var round = await queryProvider.RehydrateAsJson<SurveillanceRoundDetail>(id);
            return string.IsNullOrEmpty(round) ? 
                Results.NotFound() : 
                Results.Ok(round);
        });
        return app;
    }
}