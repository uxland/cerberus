using KeycloakClient.Features;
using KeycloakClient.Features.UserGroup;
using KeycloakClient.Shared;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace KeycloakClient;

public static class Bootstrapper
{
    public static IServiceCollection UseKeycloakClient(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<KeycloakOptions>(configuration.GetSection("Keycloak"));
        return services.SetupKeycloakClient()
            .UseUserGroupProvider();
    }
}