using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Cerberus.Surveillance.Features.Features.Operation.List;

internal static class Endpoint
{
    public static WebApplication UseListOperations(this WebApplication app)
    {
        app.MapGet("/api/surveillance/operations", async (IReadModelQueryProvider queryProvider) =>
        {
            var operations = await queryProvider.ListAsJson<SurveillanceOperationSummary>();
            return Results.Ok(operations);
        });
        return app;
    }
}