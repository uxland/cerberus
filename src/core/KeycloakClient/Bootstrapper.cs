using Cerberus.Core.KeycloakClient.Features.Auth;
using Cerberus.Core.KeycloakClient.Features.UserGroup;
using Cerberus.Core.KeycloakClient.Shared;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Cerberus.Core.KeycloakClient;

public static class Bootstrapper
{
    public static IServiceCollection UseKeycloakClient(this IServiceCollection services, IConfiguration configuration, params string [] signalRHubs)
    {
        services.Configure<KeycloakOptions>(configuration.GetSection("Keycloak"));
        return services.SetupKeycloakClient()
            .UseUserGroupProvider()
            .UseKeyCloakAuth(configuration, signalRHubs);
    }
}