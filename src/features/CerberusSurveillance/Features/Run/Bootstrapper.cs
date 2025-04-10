﻿using Cerberus.Surveillance.Features.Features.Run.Claim;
using Cerberus.Surveillance.Features.Features.Run.Create;
using Cerberus.Surveillance.Features.Features.Run.Get;
using Cerberus.Surveillance.Features.Features.Run.List;
using Cerberus.Surveillance.Features.Features.Run.Release;
using Cerberus.Surveillance.Features.Features.Run.Schedule;
using Cerberus.Surveillance.Features.Features.Run.SetInspection;
using Cerberus.Surveillance.Features.Features.Run.Start;
using Cerberus.Surveillance.Features.Features.Run.Trigger;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace Cerberus.Surveillance.Features.Features.Run;

internal static class Bootstrapper
{
    public static RouteGroupBuilder SetupRunRouting(this RouteGroupBuilder app)
    {
        var runsGroup = app.MapGroup("/runs");
        runsGroup.UseCreateRun()
            .UseGetRun()
            .UseStartRun()
            .UseSetRunInspection()
            .UseReleaseRun()
            .UseListRuns()
            .UseClaimRun();
        var operatorsGroup = app.MapGroup("/operators");
        operatorsGroup.UseOperatorsSchedule();
        return app;
    }

    public static IServiceCollection UseRuns(this IServiceCollection services)
    {
        return services.BootstrapTriggers();
    }
}