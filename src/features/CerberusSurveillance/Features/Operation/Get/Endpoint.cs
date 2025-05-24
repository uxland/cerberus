using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
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
           // var operationJson = await queryProvider.RehydrateAsJson<SurveillanceOperation>(id);
           var operation = await queryProvider.Rehydrate<SurveillanceOperation>(id);
           return operation == null
               ? Results.NotFound()
               : Results.Ok(operation);
           // return string.IsNullOrEmpty(operationJson) ? Results.NotFound() : Results.Ok(operationJson);
        });
        return app;
    }
}