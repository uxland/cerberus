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
                        //claimsIdentity.AddClaim(new Claim(ClaimTypes.NameIdentifier, context.Principal.FindFirst(ClaimTypes.NameIdentifier)?.Value));
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
                    // 1. First check if it's a WebSocket request with access_token in query
                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;

                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/cerberus-hub"))
                    {
                        context.Token = accessToken;
                        return Task.CompletedTask;
                    }

                    // 2. Fallback to Authorization header (for normal HTTP API calls)
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