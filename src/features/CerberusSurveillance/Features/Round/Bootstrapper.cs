using Cerberus.Surveillance.Features.Features.Round.Create;
using Cerberus.Surveillance.Features.Features.Round.Get;
using Cerberus.Surveillance.Features.Features.Round.List;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Cerberus.Surveillance.Features.Features.Round.Delete;

namespace Cerberus.Surveillance.Features.Features.Round;

internal static class Bootstrapper
{
    public static RouteGroupBuilder SetupRoundRouting(this RouteGroupBuilder app)
    {
        var roundsGroup = app.MapGroup("/rounds");
        roundsGroup.UseCreateRound()
            .UseListRounds()
            .UseGetRound()
            .UseDeleteRound();
        return app;
    }
}