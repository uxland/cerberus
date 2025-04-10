using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate.MasterData.Group;

internal static class Bootstrapper
{
    public static RouteGroupBuilder SetupSurveillanceGroupsRouting(this RouteGroupBuilder app)
    {
        var groupsGroup = app.MapGroup("/groups");
        groupsGroup.UseListSurveillanceGroup();
        return app;
    }
}