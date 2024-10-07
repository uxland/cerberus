using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Cerberus.Api.Bootstrap;

internal static class AuthenticationBootstrapper
{
    internal static IServiceCollection BootstrapAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.Authority = configuration.GetSection("Authentication:Authority").Value;
            options.Audience = configuration.GetSection("Authentication:Audience").Value;
            options.RequireHttpsMetadata = configuration.GetSection("Authentication:RequireHttpsMetadata")?.Get<bool>() ?? false;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
            };
        });
        return services.AddAuthorization();
    }
}