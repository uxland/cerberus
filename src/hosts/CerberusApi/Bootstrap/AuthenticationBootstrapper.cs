using System.Security.Claims;
using Cerberus.Api.Auth;
using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;

namespace Cerberus.Api.Bootstrap;

internal static class AuthenticationBootstrapper
{
    internal static IServiceCollection BootstrapAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var authority = configuration.GetSection("Authentication:Authority").Value;
        var audience = configuration.GetSection("Authentication:Audience").Value;
        return services.AddHttpContextAccessor()
            .AddSingleton<IUserContextProvider, UserContextProvider>()
            .AddJwtBearerAuthentication(authority, audience);
        
    }
}