using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using NodaTime;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Run.SetInspection;

public static class Endpoint
{
    public static RouteGroupBuilder UseSetRunInspection(this RouteGroupBuilder app)
    {
        app.MapPut("/{id}/inspections/{inspectionId}",
            async (string id, string inspectionId, RunInspectionAnswers answers , IMessageBus messageBus, IClock clock, IUserContextProvider userContextProvider) =>
            {
                var run = await messageBus.InvokeAsync<SurveillanceRun>(new SetRunInspection(id, inspectionId, userContextProvider.CurrentUser.Id, clock.GetCurrentInstant(), answers));
                return Results.Ok(run);
            });
        return app;
    }
}