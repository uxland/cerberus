using System.Security.Claims;
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
        
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.Authority = authority;
            options.Audience = audience;
            options.RequireHttpsMetadata = false;
            options.BackchannelHttpHandler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
            };
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = authority,
                ValidateAudience = true,
                ValidAudience = audience,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                RoleClaimType = "roles"
            };
            options.Events = new JwtBearerEvents
            {
                OnTokenValidated = context =>
                {
                    var claimsIdentity = context.Principal.Identity as ClaimsIdentity;
                    if (claimsIdentity != null)
                    {
                        var resourceAccess = context.Principal.FindFirst("resource_access");
                        if (resourceAccess != null)
                        {
                            var clientResource = JObject.Parse(resourceAccess.Value)?[audience ?? string.Empty];
                            var roles = clientResource?["roles"]?.ToObject<string[]>();
                            if (roles != null)
                            {
                                foreach (var role in roles)
                                {
                                    claimsIdentity.AddClaim(new Claim("roles", role));
                                }
                            }
                        }
                    }
                    return Task.CompletedTask;
                },
                OnAuthenticationFailed = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                },
                OnMessageReceived = context =>
                {
                    var authorization = context.Request.Headers["Authorization"];
                    if (string.IsNullOrEmpty(authorization))
                    {
                        return Task.CompletedTask;
                    }
                    context.Token = authorization.ToString().Replace("Bearer ", string.Empty);
                    return Task.CompletedTask;
                }
            };
        });
        return services.AddAuthorization();
    }
}