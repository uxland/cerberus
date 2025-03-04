using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Run.SetInspection;

public static class Endpoint
{
    public static RouteGroupBuilder UseSetRunInspection(this RouteGroupBuilder app)
    {
        app.MapPut("/{id}/inspection/{inspectionId}",
            async (string id, string inspectionId, SetRunInspection command, IMessageBus messageBus) =>
            {
                var run = await messageBus.InvokeAsync<SurveillanceRun>(command with
                {
                    RunId = id, InspectionId = inspectionId
                });
                return Results.Ok(run);
            });
        return app;
    }
}