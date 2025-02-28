using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Cerberus.Surveillance.Features.Features.Run.Get;

internal static class Endpoint
{
    public static RouteGroupBuilder UseGetRun(this RouteGroupBuilder app)
    {
        app.MapGet("/{id}", async (string id, IReadModelQueryProvider queryProvider) =>
        {
            var run = await queryProvider.RehydrateAsJson<SurveillanceRun>(id);
            return string.IsNullOrEmpty(run) ? 
                Results.NotFound() : 
                Results.Ok(run);
        });
        return app;
    }
}