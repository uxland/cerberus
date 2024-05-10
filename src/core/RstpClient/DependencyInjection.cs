using Cerverus.Features.Features.Captures.CaptureSnapshots;
using Microsoft.Extensions.DependencyInjection;

namespace Cerverus.Core.RstpClient;

public static class DependencyInjection
{
    public static IServiceCollection UseRstpClient(this IServiceCollection services)
    {
        return services.AddSingleton<ISnapshotCatcher, RstpClientImplementation>();
    }
}