using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Cerberus.Core.KeycloakClient.Features.Auth;

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
                            using var jsonDocument = JsonDocument.Parse(resourceAccess.Value);
                            if (jsonDocument.RootElement.TryGetProperty(audience ?? string.Empty, out var clientResource) &&
                                clientResource.TryGetProperty("roles", out var rolesElement))
                            {
                                foreach (var role in rolesElement.EnumerateArray())
                                {
                                    claimsIdentity.AddClaim(new Claim("roles", role.GetString() ?? string.Empty));
                                }
                            }
                        }

                        // 👇 Add support for extracting groups
                        var groupClaims = context.Principal.FindAll("groups").ToList();
                        foreach (var groupClaim in groupClaims)
                        {
                            claimsIdentity.AddClaim(new Claim("groups", groupClaim.Value));
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
                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;

                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/cerberus-hub"))
                    {
                        context.Token = accessToken;
                        return Task.CompletedTask;
                    }

                    var authorization = context.Request.Headers["Authorization"];
                    if (!string.IsNullOrEmpty(authorization))
                    {
                        context.Token = authorization.ToString().Replace("Bearer ", string.Empty);
                    }

                    return Task.CompletedTask;
                }
            };
        });
        return services.AddAuthorization();
    }
}