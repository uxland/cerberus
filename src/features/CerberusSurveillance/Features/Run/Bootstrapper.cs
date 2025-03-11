using Cerberus.Surveillance.Features.Features.Run.Create;
using Cerberus.Surveillance.Features.Features.Run.Get;
using Cerberus.Surveillance.Features.Features.Run.Start;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace Cerberus.Surveillance.Features.Features.Run;

internal static class Bootstrapper
{
    public static RouteGroupBuilder SetupRunRouting(this RouteGroupBuilder app)
    {
        var runsGroup = app.MapGroup("/runs");
        runsGroup.UseCreateRun()
            .UseGetRun()
            .UseStartRun();
        return app;
    }
}