using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using static System.String;

namespace Cerberus.Surveillance.Features.Features.Operation.Get;

public static class Endpoint
{
    public static WebApplication UseGetOperation(this WebApplication app)
    {
        app.MapGet("/api/surveillance/operations/{id}", async (string id, IReadModelQueryProvider queryProvider) =>
        {
           var operation = await queryProvider.RehydrateAsJson<SurveillanceOperation>(id);
           return IsNullOrEmpty(operation) ? Results.NotFound() : Results.Ok(operation);
        });
        return app;
    }
}