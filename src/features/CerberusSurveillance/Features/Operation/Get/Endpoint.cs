using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Cerberus.Surveillance.Features.Features.Operation.Get;

public static class Endpoint
{
    public static RouteGroupBuilder UseGetOperation(this RouteGroupBuilder app)
    {
        app.MapGet("/{id}", async (string id, IReadModelQueryProvider queryProvider) =>
        {
            var operation = await queryProvider.RehydrateAsJson<SurveillanceOperation>(id);
            return string.IsNullOrEmpty(operation) ? Results.NotFound() : Results.Ok(operation);
        });
        return app;
    }
}