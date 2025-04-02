using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate.MasterData.Group;

internal static class EndPoint
{
    public static RouteGroupBuilder UseListSurveillanceGroup(this RouteGroupBuilder app)
    {
        app.MapGet("", async (IMessageBus messageBus) =>
        {
            var groups = await messageBus.InvokeAsync<IEnumerable<SurveillanceGroup>>(new ListSurveillanceGroups());
            Results.Ok(groups);
        });
        return app;
    }
}