using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Cerberus.BackOffice.Features.Captures.Triggers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Cerberus.BackOffice.Features.Captures;

internal static class DependencyInjection
{
    internal static IServiceCollection UseCaptureFeatures(this IServiceCollection services, IConfiguration configuration)
    {
        return services
            .AddScoped<CaptureSnapshotService>()
            .BoostrapTriggers(configuration);
    }
}