
using Cerberus.Surveillance.Features.Features.Run.Trigger.Jobs;
using Microsoft.Extensions.DependencyInjection;
using Quartz;

namespace Cerberus.Surveillance.Features.Features.Run.Trigger;

internal static class Bootstrapper
{
    public static IServiceCollection BootstrapTriggers(this IServiceCollection services)
    {
        return services.AddQuartz(q =>
        {
            q.AddJob<CreateRunJob>(
                c =>
                {
                    c.WithIdentity(CreateRunJob.JobKey)
                        .StoreDurably(true)
                        .Build();
                });
        });
    }
}