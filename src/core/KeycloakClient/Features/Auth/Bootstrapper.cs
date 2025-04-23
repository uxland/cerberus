using Cerberus.Core.Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Cerberus.Core.KeycloakClient.Features.Auth;

internal static class Bootstrapper
{
    internal static IServiceCollection UseKeyCloakAuth(this IServiceCollection services, IConfiguration configuration)
    {
        var authority = configuration.GetSection("Authentication:Authority").Value;
        var audience = configuration.GetSection("Authentication:Audience").Value;
        return services.AddHttpContextAccessor()
            .AddSingleton<IUserContextProvider, UserContextProvider>()
            .AddJwtBearerAuthentication(authority, audience);
    }
}