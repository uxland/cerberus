using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;

namespace Cerberus.Api.Auth;

internal static class JwtBearerAuthentication
{
    internal static IServiceCollection AddJwtBearerAuthentication(this IServiceCollection services, string? authority,
        string? audience)
    {
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
                    if (context.Principal?.Identity is ClaimsIdentity claimsIdentity)
                    {
                        var resourceAccess = context.Principal.FindFirst("resource_access");
                        if (resourceAccess != null)
                        {
                            var clientResource = JObject.Parse(resourceAccess.Value)[audience ?? string.Empty];
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