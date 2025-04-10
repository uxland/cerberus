﻿using Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate;
using Cerberus.Surveillance.Features.Features.Round.Get;
using Cerberus.Surveillance.Features.Features.Round.List;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Cerberus.Surveillance.Features.Features.Round.Delete;
using Cerberus.Surveillance.Features.Features.Round.MasterData;

namespace Cerberus.Surveillance.Features.Features.Round;

internal static class Bootstrapper
{
    public static RouteGroupBuilder SetupRoundRouting(this RouteGroupBuilder app)
    {
        var roundsGroup = app.MapGroup("/rounds");
        roundsGroup.UseCreateRound()
            .UseListRounds()
            .UseGetRound()
            .UseDeleteRound()
            .SetupMasterDataRouting();
        return app;
    }
}