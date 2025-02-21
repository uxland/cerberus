using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Cerberus.Surveillance.Features.Features.Operation.List;

internal static class Endpoint
{
    public static RouteGroupBuilder UseListOperations(this RouteGroupBuilder app)
    {
        app.MapGet("", async (IReadModelQueryProvider queryProvider) =>
        {
            var operations = await queryProvider.ListAsJson<SurveillanceOperationSummary>();
            return Results.Ok(operations);
        });
        return app;
    }
}