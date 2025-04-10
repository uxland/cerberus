using Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate.MasterData.Group;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace Cerberus.Surveillance.Features.Features.Round.MasterData;

internal static class Bootstrapper
{
    public static RouteGroupBuilder SetupMasterDataRouting(this RouteGroupBuilder app)
    {
        var masterDataGroup = app.MapGroup("/master-data");
        masterDataGroup.SetupSurveillanceGroupsRouting();
        return app;
    }
}