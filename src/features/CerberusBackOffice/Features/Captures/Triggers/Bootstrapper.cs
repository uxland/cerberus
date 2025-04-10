using Cerberus.BackOffice.Features.Captures.Triggers.Jobs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Quartz;

namespace Cerberus.BackOffice.Features.Captures.Triggers;

public static class Bootstrapper
{
    public static IServiceCollection BoostrapTriggers(this IServiceCollection services, IConfiguration configuration)
    {

        return services.AddQuartz(q =>
        {
            q.AddJob<CaptureJob>(configurator =>
            {
                configurator
                    .WithIdentity(CaptureJob.JobKey)
                    .StoreDurably(true)
                    .Build();
            });
        });

    }

}