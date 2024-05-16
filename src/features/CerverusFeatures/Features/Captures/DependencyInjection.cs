using Cerverus.Features.Features.Captures.CaptureSnapshots;
using Microsoft.Extensions.DependencyInjection;

namespace Cerverus.Features.Features.Captures;

internal static class DependencyInjection
{
    internal static IServiceCollection UseCaptureFeatures(this IServiceCollection services)
    {
        return services
            .AddScoped<CaptureSnapshotService>();
    }
}