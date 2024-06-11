using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Microsoft.Extensions.DependencyInjection;

namespace Cerberus.BackOffice.Features.Captures;

internal static class DependencyInjection
{
    internal static IServiceCollection UseCaptureFeatures(this IServiceCollection services)
    {
        return services
            .AddScoped<CaptureSnapshotService>();
    }
}