using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Cerberus.Core.KeycloakClient.Shared;

internal static class Bootstrapper
{
    internal static IServiceCollection SetupKeycloakClient(this IServiceCollection services)
    {
        services.AddHttpClient<KeycloakApiClient>((provider, client) =>
            {
                var options = provider.GetRequiredService<IOptions<KeycloakOptions>>().Value;
                client.BaseAddress = new Uri(options.BaseUrl.TrimEnd('/') + "/");
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            }
        ).ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
        });
        return services;
    }
}