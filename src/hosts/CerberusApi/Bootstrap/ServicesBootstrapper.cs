using KeycloakClient;
using NodaTime;

namespace Cerberus.Api.Bootstrap;

internal static class ServicesBootstrapper
{
    public static IServiceCollection BootstrapServices(this IServiceCollection services)
    {
        return services.AddSingleton<IClock>(SystemClock.Instance);
    }
}